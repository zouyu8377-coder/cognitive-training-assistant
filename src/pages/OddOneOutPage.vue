<template>
  <PageContainer>
    <ProgressHeader :title="`找不同 ${currentIndex + 1}/${questions.length}`" label="找出不一样的那个" />
    <section class="stack">
      <ResultCard>
        <h2>{{ current.prompt }}</h2>
        <div class="odd-grid">
          <button
            v-for="(item, index) in current.grid"
            :key="`${current.id}-${index}`"
            class="odd-item"
            type="button"
            :disabled="waiting"
            @click="choose(index)"
          >
            {{ item }}
          </button>
        </div>
      </ResultCard>
      <p class="hint">{{ message }}</p>
      <AppButton tone="quiet" block :disabled="waiting" @click="skip">先跳过</AppButton>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import { useTrainingStore } from '../stores/trainingStore';
import { firstPendingOddIndex, nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();
const session = store.ensureSession();
const questions = session.oddOneOutQuestions ?? [];
const currentIndex = ref(firstPendingOddIndex(session));
const current = computed(() => questions[currentIndex.value]);
const startedAt = ref(Date.now());
const message = ref('请点一下不一样的那个。');
const waiting = ref(false);

function record(selectedIndex: number | undefined, skipped: boolean) {
  const question = current.value;
  store.setOddOneOutQuestion(currentIndex.value, {
    ...question,
    selectedIndex,
    skipped,
    isCorrect: skipped ? false : selectedIndex === question.answerIndex,
    timeSpentSeconds: Math.max(1, Math.round((Date.now() - startedAt.value) / 1000)),
  });
}

function moveOn() {
  const nextIndex = questions.findIndex(
    (question, index) => index > currentIndex.value && question.selectedIndex === undefined && !question.skipped,
  );
  if (nextIndex < 0) {
    router.push(nextTaskRoute(store.state.settings, session));
    return;
  }
  currentIndex.value = nextIndex;
  message.value = '继续找下一个。';
  startedAt.value = Date.now();
}

function choose(index: number) {
  const isCorrect = index === current.value.answerIndex;
  record(index, false);
  waiting.value = true;
  message.value = isCorrect ? '找对啦，很细心。' : '已经认真找了，继续试试下一题。';
  window.setTimeout(() => {
    waiting.value = false;
    moveOn();
  }, 650);
}

function skip() {
  record(undefined, true);
  moveOn();
}
</script>

<style scoped>
h2 {
  margin: 0 0 16px;
  text-align: center;
}

.odd-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.odd-item {
  min-height: 78px;
  border: 1px solid #cad8d1;
  border-radius: 8px;
  background: #ffffff;
  color: #1689b6;
  font-size: 2rem;
  font-weight: 900;
}

.hint {
  min-height: 28px;
  color: #52615d;
}
</style>
