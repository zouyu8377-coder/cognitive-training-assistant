<template>
  <PageContainer>
    <ProgressHeader title="数字顺序练习" label="按 1、2、3 的顺序点" />
    <section class="stack">
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
      <AppButton tone="quiet" block @click="finish(false)">今天先到这里</AppButton>
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
import type { NumberDot } from '../types';

const router = useRouter();
const store = useTrainingStore();
const level = store.state.settings.numberConnectLevel;
const nextValue = ref(1);
const wrongClicks = ref(0);
const startedAt = Date.now();
const hint = ref('请先点击 1。');

const dots = ref<NumberDot[]>(
  Array.from({ length: level }, (_, index) => ({
    value: index + 1,
    x: 10 + Math.random() * 72,
    y: 8 + Math.random() * 76,
    completed: false,
  })),
);

function nextRoute() {
  if (store.state.settings.includeWritingTask) return '/writing';
  if (store.state.settings.includeSingingTask) return '/singing';
  return '/complete';
}

function finish(completed: boolean) {
  store.setNumberConnectResult({
    level,
    completed,
    wrongClicks: wrongClicks.value,
    durationSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
  });
  router.push(nextRoute());
}

function tap(value: number) {
  if (value !== nextValue.value) {
    wrongClicks.value += 1;
    hint.value = '再试一次，找找下一个数字。';
    return;
  }
  const dot = dots.value.find((item) => item.value === value);
  if (dot) dot.completed = true;
  nextValue.value += 1;
  hint.value = nextValue.value > level ? '完成啦。' : `很好，接着点 ${nextValue.value}。`;
  if (nextValue.value > level) finish(true);
}
</script>

<style scoped>
.board {
  position: relative;
  height: min(68vh, 520px);
  min-height: 430px;
  border: 1px solid #d8dccf;
  border-radius: 8px;
  background: #fffdf7;
}

.dot {
  position: absolute;
  width: 64px;
  height: 64px;
  transform: translate(-50%, -50%);
  border: 2px solid #78a08f;
  border-radius: 50%;
  background: #ffffff;
  color: #213633;
  font-size: 1.45rem;
  font-weight: 900;
}

.dot.done {
  background: #dfe9df;
  color: #789084;
}

.hint {
  min-height: 30px;
  font-size: 1.08rem;
  color: #52615d;
}
</style>
