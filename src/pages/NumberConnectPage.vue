<template>
  <PageContainer>
    <ProgressHeader title="数字顺序练习" :label="orderLabel" />
    <section class="number-task">
      <div class="board">
        <button
          v-for="dot in dots"
          :key="dot.value"
          class="dot"
          :class="{ done: dot.completed }"
          :style="{ left: `${dot.x}%`, top: `${dot.y}%` }"
          type="button"
          @click="tap(dot.value)"
        >
          {{ dot.value }}
        </button>
      </div>
      <p class="hint">{{ hint }}</p>
      <div class="actions">
        <AppButton tone="quiet" block @click="finish(false)">今天先到这里</AppButton>
      </div>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import { useTrainingStore } from '../stores/trainingStore';
import type { NumberConnectOrder, NumberDot } from '../types';
import { nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();
const session = store.ensureSession();
const level = store.state.settings.numberConnectLevel;
const order: NumberConnectOrder = session.numberConnectOrder ?? (Math.random() > 0.5 ? 'ascending' : 'descending');
store.setNumberConnectOrder(order);
const orderLabel = order === 'ascending' ? '从小到大点' : '从大到小点';
const initialValue = order === 'ascending' ? 1 : level;
const nextValue = ref(initialValue);
const wrongClicks = ref(0);
const startedAt = Date.now();
const hint = ref(`请先点击 ${initialValue}。`);

function shuffledPositions(count: number) {
  const columns = count <= 5 ? 2 : count <= 10 ? 3 : 4;
  const rows = Math.ceil(count / columns);
  const positions = Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      x: ((column + 0.5) / columns) * 86 + 7 + (Math.random() - 0.5) * 5,
      y: ((row + 0.5) / rows) * 82 + 8 + (Math.random() - 0.5) * 5,
    };
  });
  return positions.sort(() => Math.random() - 0.5);
}

const positions = shuffledPositions(level);
const dots = ref<NumberDot[]>(
  Array.from({ length: level }, (_, index) => ({
    value: index + 1,
    x: positions[index].x,
    y: positions[index].y,
    completed: false,
  })),
);

function finish(completed: boolean) {
  store.setNumberConnectResult({
    level,
    order,
    completed,
    wrongClicks: wrongClicks.value,
    durationSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
  });
  router.push(nextTaskRoute(store.state.settings, session));
}

function tap(value: number) {
  if (value !== nextValue.value) {
    wrongClicks.value += 1;
    hint.value = '再试一次，找找下一个数字。';
    return;
  }
  const dot = dots.value.find((item) => item.value === value);
  if (dot) dot.completed = true;
  nextValue.value = order === 'ascending' ? nextValue.value + 1 : nextValue.value - 1;
  const done = order === 'ascending' ? nextValue.value > level : nextValue.value < 1;
  hint.value = done ? '完成啦。' : `很好，接着点 ${nextValue.value}。`;
  if (done) finish(true);
}
</script>

<style scoped>
.number-task {
  min-height: calc(100svh - 116px);
  display: grid;
  grid-template-rows: minmax(300px, 1fr) minmax(30px, auto) auto;
  gap: 12px;
}

.board {
  position: relative;
  height: 100%;
  min-height: 300px;
  border: 1px solid #d8dccf;
  border-radius: 8px;
  background: #fffdf7;
}

.dot {
  position: absolute;
  width: clamp(52px, 13vw, 64px);
  height: clamp(52px, 13vw, 64px);
  transform: translate(-50%, -50%);
  border: 2px solid #78a08f;
  border-radius: 50%;
  background: #ffffff;
  color: #213633;
  font-size: clamp(1.18rem, 5vw, 1.45rem);
  font-weight: 900;
}

.dot.done {
  background: #dfe9df;
  color: #789084;
}

.hint {
  min-height: 30px;
  margin: 0;
  font-size: 1.08rem;
  color: #52615d;
}

.actions {
  position: sticky;
  bottom: 10px;
  background: #f7f5ef;
}

@media (max-height: 700px) {
  .number-task {
    min-height: calc(100svh - 96px);
    grid-template-rows: minmax(260px, 1fr) minmax(28px, auto) auto;
    gap: 8px;
  }
}
</style>
