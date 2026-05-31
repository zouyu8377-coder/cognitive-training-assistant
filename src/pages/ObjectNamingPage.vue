<template>
  <PageContainer>
    <ProgressHeader :title="`看图说名称 ${currentIndex + 1}/${questions.length}`" label="看一看，说一说" />
    <section class="stack">
      <ResultCard>
        <LineArt :kind="current.icon" :label="current.name" />
      </ResultCard>
      <label>
        请输入或说出这个事物的名称
        <input v-model="answer" placeholder="例如：桌子" />
      </label>
      <DrawingCanvas ref="canvas" @redraw="inputMethod = 'handwriting'" />
      <p class="hint">{{ message }}</p>
      <div class="actions">
        <AppButton tone="quiet" @click="skip">先跳过</AppButton>
        <AppButton tone="secondary" @click="startVoice">语音输入</AppButton>
        <AppButton :disabled="waiting" @click="submit">确认</AppButton>
      </div>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import DrawingCanvas from '../components/DrawingCanvas.vue';
import LineArt from '../components/LineArt.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import { useTrainingStore } from '../stores/trainingStore';
import { isObjectAnswerCorrect } from '../utils/visualTraining';
import { firstPendingObjectIndex, nextTaskRoute } from '../utils/trainingFlow';

type SpeechRecognitionConstructor = new () => {
  lang: string;
  interimResults: boolean;
  start: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
};

const router = useRouter();
const store = useTrainingStore();
const session = store.ensureSession();
const questions = session.objectNamingQuestions ?? [];
const currentIndex = ref(firstPendingObjectIndex(session));
const answer = ref('');
const inputMethod = ref<'text' | 'voice' | 'handwriting'>('text');
const message = ref('可以写字、打字，也可以点语音输入。');
const waiting = ref(false);
const startedAt = ref(Date.now());
const current = computed(() => questions[currentIndex.value]);

function record(skipped: boolean) {
  store.setObjectNamingQuestion(currentIndex.value, {
    ...current.value,
    userAnswer: skipped ? undefined : answer.value.trim(),
    inputMethod: skipped ? 'skipped' : inputMethod.value,
    isCorrect: skipped ? false : isObjectAnswerCorrect(current.value, answer.value),
    skipped,
    timeSpentSeconds: Math.max(1, Math.round((Date.now() - startedAt.value) / 1000)),
  });
}

function moveOn() {
  if (currentIndex.value >= questions.length - 1) {
    router.push(nextTaskRoute(store.state.settings, session));
    return;
  }
  currentIndex.value += 1;
  answer.value = '';
  inputMethod.value = 'text';
  message.value = '继续下一张图。';
  startedAt.value = Date.now();
}

function submit() {
  if (!answer.value.trim()) {
    message.value = '可以先输入名称，也可以先跳过。';
    return;
  }
  record(false);
  waiting.value = true;
  message.value = isObjectAnswerCorrect(current.value, answer.value) ? '很好，认出来啦。' : '已经认真尝试了，继续下一题。';
  window.setTimeout(() => {
    waiting.value = false;
    moveOn();
  }, 650);
}

function skip() {
  record(true);
  message.value = '先放一放也可以。';
  moveOn();
}

function startVoice() {
  const SpeechRecognition =
    (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor })
      .SpeechRecognition ??
    (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor })
      .webkitSpeechRecognition;
  if (!SpeechRecognition) {
    message.value = '当前浏览器不支持语音输入，可以打字或手写。';
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'zh-CN';
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    answer.value = event.results[0][0].transcript;
    inputMethod.value = 'voice';
    message.value = '已经听到啦，可以确认。';
  };
  recognition.onerror = () => {
    message.value = '这次没有听清，可以再试一次。';
  };
  recognition.start();
}
</script>

<style scoped>
label {
  display: grid;
  gap: 8px;
  font-weight: 800;
}

input {
  min-height: 56px;
  border: 1px solid #c9d6cf;
  border-radius: 8px;
  padding: 12px;
  background: #ffffff;
}

.hint {
  min-height: 28px;
  color: #52615d;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
</style>
