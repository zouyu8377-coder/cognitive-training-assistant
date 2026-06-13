<template>
  <PageContainer>
    <ProgressHeader :title="`数学练习 ${currentIndex + 1}/${questions.length}`" label="慢慢来">
      <template #action>
        <button type="button" :disabled="waiting" @click="skip">跳过</button>
      </template>
    </ProgressHeader>
    <section class="math">
      <div class="question">{{ current.expression }}</div>
      <div class="answer" :class="feedback">
        <span class="answer-value">{{ answer || ' ' }}</span>
        <div v-if="feedback" class="answer-feedback" role="status">
          <strong>{{ feedback === 'correct' ? '✓' : '再试试' }}</strong>
          <small>{{ feedback === 'correct' ? '答对啦！' : '差一点，下一题继续' }}</small>
        </div>
      </div>
      <LargeNumberPad @press="append" @clear="answer = ''" @backspace="backspace" />
      <p class="soft">{{ message }}</p>
      <AppButton class="confirm-answer" block :disabled="waiting" @click="next">确认答案</AppButton>
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
const feedback = ref<'' | 'correct' | 'try-again'>('');
const current = computed(() => questions[currentIndex.value]);

function append(value: number) {
  if (waiting.value) return;
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
  feedback.value = '';
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
  feedback.value = isCorrect ? 'correct' : 'try-again';
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
  grid-template-rows: minmax(90px, 0.8fr) auto auto minmax(24px, auto) auto;
  gap: 12px;
}

.question {
  min-height: 86px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: transparent;
  font-size: clamp(2.4rem, 12vw, 3.2rem);
  font-weight: 900;
}

.answer {
  min-height: 74px;
  display: grid;
  place-items: center;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  background: var(--color-surface);
  font-size: clamp(2rem, 8vw, 2.4rem);
  font-weight: 900;
}

.answer.correct,
.answer.try-again {
  grid-template-columns: minmax(70px, 1fr) minmax(128px, auto);
  padding: 6px 10px 6px 18px;
}

.answer.correct {
  border-color: var(--color-success);
  background: #eaf7ed;
}

.answer.try-again {
  border-color: var(--color-warning);
  background: #fff5dc;
}

.answer-feedback {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 3px 8px;
  color: #256b47;
}

.answer-feedback strong {
  grid-row: 1 / 3;
  min-width: 48px;
  min-height: 48px;
  display: grid;
  place-items: center;
  border: 2px solid currentColor;
  border-radius: 8px;
  font-size: 1rem;
}

.answer-feedback small {
  font-weight: 800;
}

.answer.try-again .answer-feedback {
  color: #9a6818;
}

.soft {
  min-height: 28px;
  margin: 0;
  color: #5b6b66;
}

.confirm-answer {
  min-height: 58px;
}

@media (max-width: 520px) {
  .math {
    min-height: calc(100svh - 80px);
    gap: 8px;
  }

  .question {
    min-height: 72px;
  }

  .answer {
    min-height: 48px;
  }

}
</style>
