<template>
  <PageContainer>
    <ProgressHeader title="写名字" label="纸笔任务" />
    <section class="task stack">
      <p>请在纸上写一次自己的名字。写完后点击“已完成”。</p>
      <div class="touch-box">
        <canvas
          ref="canvas"
          width="620"
          height="260"
          @pointerdown="startDraw"
          @pointermove="draw"
          @pointerup="stopDraw"
          @pointerleave="stopDraw"
        ></canvas>
      </div>
      <AppButton tone="quiet" block @click="clearCanvas">清空触屏书写区</AppButton>
      <AppButton block @click="choose('completed')">已完成</AppButton>
      <AppButton tone="secondary" block @click="choose('skipped')">今天不想做</AppButton>
      <AppButton tone="quiet" block @click="choose('help_needed')">需要家属帮助</AppButton>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import { useTrainingStore } from '../stores/trainingStore';
import type { TrainingSession } from '../types';
import { nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();
const canvas = ref<HTMLCanvasElement>();
const drawing = ref(false);

function context() {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return undefined;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#26312f';
  return ctx;
}

function point(event: PointerEvent) {
  const rect = canvas.value?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  return {
    x: ((event.clientX - rect.left) / rect.width) * (canvas.value?.width ?? 1),
    y: ((event.clientY - rect.top) / rect.height) * (canvas.value?.height ?? 1),
  };
}

function startDraw(event: PointerEvent) {
  drawing.value = true;
  const ctx = context();
  const pos = point(event);
  ctx?.beginPath();
  ctx?.moveTo(pos.x, pos.y);
}

function draw(event: PointerEvent) {
  if (!drawing.value) return;
  const ctx = context();
  const pos = point(event);
  ctx?.lineTo(pos.x, pos.y);
  ctx?.stroke();
}

function stopDraw() {
  drawing.value = false;
}

function clearCanvas() {
  const ctx = context();
  if (canvas.value) ctx?.clearRect(0, 0, canvas.value.width, canvas.value.height);
}

function choose(status: TrainingSession['writingStatus']) {
  const session = store.ensureSession();
  store.setWritingStatus(status);
  router.push(nextTaskRoute(store.state.settings, session));
}

onMounted(() => {
  clearCanvas();
});
</script>

<style scoped>
.task {
  padding-top: 20px;
}

p {
  font-size: 1.45rem;
  line-height: 1.6;
}

.touch-box {
  border: 2px dashed #b8c8bf;
  border-radius: 8px;
  background: #ffffff;
}

canvas {
  display: block;
  width: 100%;
  height: 220px;
  touch-action: none;
}
</style>
