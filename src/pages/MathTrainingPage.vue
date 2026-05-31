<template>
  <PageContainer>
    <ProgressHeader :title="`数学练习 ${currentIndex + 1}/${questions.length}`" label="慢慢来" />
    <section class="math stack">
      <div class="question">{{ current.expression }}</div>
      <div class="answer">{{ answer || ' ' }}</div>
      <LargeNumberPad @press="append" @clear="answer = ''" @backspace="backspace" />
      <p class="soft">{{ message }}</p>
      <div class="actions">
        <AppButton tone="quiet" @click="skip">跳过</AppButton>
        <AppButton @click="next">下一题</AppButton>
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

const router = useRouter();
const store = useTrainingStore();
const session = store.ensureSession();
const questions = session.mathQuestions;
const currentIndex = ref(0);
const answer = ref('');
const startedAt = ref(Date.now());
const message = ref('输入答案后点下一题。');
const current = computed(() => questions[currentIndex.value]);

function append(value: number) {
  if (answer.value.length < 3) answer.value += String(value);
}

function backspace() {
  answer.value = answer.value.slice(0, -1);
}

function record(skipped: boolean) {
  const userAnswer = answer.value ? Number(answer.value) : undefined;
  store.setMathQuestion(currentIndex.value, {
    ...current.value,
    userAnswer,
    skipped,
    isCorrect: skipped ? false : userAnswer === current.value.correctAnswer,
    timeSpentSeconds: Math.max(1, Math.round((Date.now() - startedAt.value) / 1000)),
  });
}

function moveOn() {
  if (currentIndex.value >= questions.length - 1) {
    router.push('/number-connect');
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
  record(false);
  moveOn();
}

function skip() {
  record(true);
  moveOn();
}
</script>

<style scoped>
.question {
  min-height: 120px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #ffffff;
  font-size: 3.4rem;
  font-weight: 900;
}

.answer {
  min-height: 70px;
  display: grid;
  place-items: center;
  border-bottom: 3px solid #8fb1a2;
  font-size: 2.4rem;
  font-weight: 900;
}

.soft {
  min-height: 28px;
  color: #5b6b66;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
</style>
