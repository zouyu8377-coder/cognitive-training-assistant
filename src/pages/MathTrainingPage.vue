<template>
  <PageContainer>
    <ProgressHeader :title="`数学练习 ${currentIndex + 1}/${questions.length}`" label="慢慢来" />
    <section class="math">
      <div class="question">{{ current.expression }}</div>
      <div class="answer">{{ answer || ' ' }}</div>
      <LargeNumberPad @press="append" @clear="answer = ''" @backspace="backspace" />
      <p class="soft">{{ message }}</p>
      <div class="actions">
        <AppButton tone="quiet" :disabled="waiting" @click="skip">跳过</AppButton>
        <AppButton :disabled="waiting" @click="next">下一题</AppButton>
      </div>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import LargeNumberPad from '../components/LargeNumberPad.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import { useTrainingStore } from '../stores/trainingStore';
import { firstPendingMathIndex, nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();
const session = store.ensureSession();
const questions = session.mathQuestions;
const currentIndex = ref(firstPendingMathIndex(session));
const answer = ref('');
const startedAt = ref(Date.now());
const message = ref('输入答案后点下一题。');
const waiting = ref(false);
const current = computed(() => questions[currentIndex.value]);

function append(value: number) {
  if (answer.value.length < 3) answer.value += String(value);
}

function backspace() {
  answer.value = answer.value.slice(0, -1);
}

function record(skipped: boolean) {
  const userAnswer = answer.value ? Number(answer.value) : undefined;
  const isCorrect = skipped ? false : userAnswer === current.value.correctAnswer;
  store.setMathQuestion(currentIndex.value, {
    ...current.value,
    userAnswer,
    skipped,
    isCorrect,
    timeSpentSeconds: Math.max(1, Math.round((Date.now() - startedAt.value) / 1000)),
  });
  return isCorrect;
}

function moveOn() {
  if (currentIndex.value >= questions.length - 1) {
    router.push(nextTaskRoute(store.state.settings, session));
    return;
  }
  currentIndex.value += 1;
  answer.value = '';
  message.value = '继续下一题。';
  startedAt.value = Date.now();
}

function next() {
  if (!answer.value) {
    message.value = '可以输入答案，也可以先跳过。';
    return;
  }
  const isCorrect = record(false);
  waiting.value = true;
  message.value = isCorrect ? '答对啦，很好。' : '已经认真尝试了，继续保持。';
  window.setTimeout(() => {
    waiting.value = false;
    moveOn();
  }, 650);
}

function skip() {
  record(true);
  moveOn();
}
</script>

<style scoped>
.math {
  min-height: calc(100svh - 116px);
  display: grid;
  grid-template-rows: minmax(86px, 0.85fr) auto auto minmax(28px, auto) auto;
  gap: 12px;
}

.question {
  min-height: 86px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #ffffff;
  font-size: clamp(2.45rem, 12vw, 3.4rem);
  font-weight: 900;
}

.answer {
  min-height: 56px;
  display: grid;
  place-items: center;
  border-bottom: 3px solid #8fb1a2;
  font-size: clamp(2rem, 8vw, 2.4rem);
  font-weight: 900;
}

.soft {
  min-height: 28px;
  margin: 0;
  color: #5b6b66;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  position: sticky;
  bottom: 10px;
  padding-top: 2px;
  background: #f7f5ef;
}

@media (max-width: 520px) {
  .math {
    min-height: calc(100svh - 72px);
    gap: 8px;
  }

  .question {
    min-height: 72px;
  }

  .answer {
    min-height: 48px;
  }

  .actions {
    bottom: 4px;
  }
}
</style>
