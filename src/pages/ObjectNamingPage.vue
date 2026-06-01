<template>
  <PageContainer>
    <ProgressHeader :title="`看图说名称 ${currentIndex + 1}/${questions.length}`" label="看一看，说一说" />
    <section class="stack">
      <ResultCard>
        <LineArt :kind="current.icon" :label="current.name" />
      </ResultCard>
      <DrawingCanvas ref="canvas" @draw="hasDrawing = true" />
      <p class="hint">{{ message }}</p>
      <div class="primary-actions">
        <AppButton tone="quiet" :disabled="waiting" @click="rewrite">重写</AppButton>
        <AppButton :disabled="waiting" @click="submitHandwriting">手写完成</AppButton>
      </div>
      <AppButton tone="quiet" :disabled="waiting" block @click="skip">先跳过</AppButton>
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
import { firstPendingObjectIndex, nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();
const session = store.ensureSession();
const questions = session.objectNamingQuestions ?? [];
const currentIndex = ref(firstPendingObjectIndex(session));
const canvas = ref<InstanceType<typeof DrawingCanvas>>();
const hasDrawing = ref(false);
const message = ref('可以在空白区手写名称，也可以点语音输入。');
const waiting = ref(false);
const startedAt = ref(Date.now());
const current = computed(() => questions[currentIndex.value]);

function recordHandwriting(skipped: boolean) {
  store.setObjectNamingQuestion(currentIndex.value, {
    ...current.value,
    userAnswer: undefined,
    inputMethod: skipped ? 'skipped' : 'handwriting',
    drawingDataUrl: skipped ? undefined : canvas.value?.snapshot(),
    isCorrect: undefined,
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
  hasDrawing.value = false;
  canvas.value?.clear(false);
  message.value = '继续下一张图。';
  startedAt.value = Date.now();
}

function submitHandwriting() {
  recordHandwriting(false);
  waiting.value = true;
  message.value = '写好啦，家属稍后可以查看。';
  window.setTimeout(() => {
    waiting.value = false;
    moveOn();
  }, 650);
}

function rewrite() {
  canvas.value?.clear();
  hasDrawing.value = false;
  message.value = '可以重新写。';
}

function skip() {
  recordHandwriting(true);
  message.value = '先放一放也可以。';
  moveOn();
}

</script>

<style scoped>
.hint {
  min-height: 28px;
  color: #52615d;
}

.primary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
</style>
