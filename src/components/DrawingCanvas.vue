<template>
  <div class="touch-box">
    <div class="draw-toolbar">
      <strong>{{ activeLabel || inactiveLabel }}</strong>
      <span>请直接在下方书写</span>
    </div>
    <canvas
      ref="canvas"
      width="620"
      height="300"
      @pointerdown="startDraw"
      @pointermove="draw"
      @pointerup="stopDraw"
      @pointerleave="stopDraw"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { DrawingPoint } from '../types';

withDefaults(
  defineProps<{
    inactiveLabel?: string;
    activeLabel?: string;
  }>(),
  {
    inactiveLabel: '书写/绘画区',
    activeLabel: '正在书写/绘画',
  },
);

const emit = defineEmits<{ redraw: []; draw: [] }>();
const canvas = ref<HTMLCanvasElement>();
const drawing = ref(false);
const points = ref<DrawingPoint[]>([]);
const strokeId = ref('');

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
  event.preventDefault();
  canvas.value?.setPointerCapture(event.pointerId);
  drawing.value = true;
  emit('draw');
  strokeId.value = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const ctx = context();
  const pos = point(event);
  points.value.push({ ...pos, t: Date.now(), strokeId: strokeId.value });
  ctx?.beginPath();
  ctx?.moveTo(pos.x, pos.y);
}

function draw(event: PointerEvent) {
  if (!drawing.value) return;
  event.preventDefault();
  const ctx = context();
  const pos = point(event);
  points.value.push({ ...pos, t: Date.now(), strokeId: strokeId.value });
  ctx?.lineTo(pos.x, pos.y);
  ctx?.stroke();
}

function stopDraw(event?: PointerEvent) {
  if (event && canvas.value?.hasPointerCapture(event.pointerId)) {
    canvas.value.releasePointerCapture(event.pointerId);
  }
  drawing.value = false;
}

function clear(shouldEmit = true) {
  const ctx = context();
  if (canvas.value) ctx?.clearRect(0, 0, canvas.value.width, canvas.value.height);
  points.value = [];
  if (shouldEmit) emit('redraw');
}

function snapshot(): string | undefined {
  return canvas.value?.toDataURL('image/png');
}

function getPoints(): DrawingPoint[] {
  return points.value.map((item) => ({ ...item }));
}

function getSize() {
  return {
    width: canvas.value?.width ?? 620,
    height: canvas.value?.height ?? 300,
  };
}

defineExpose({ clear, snapshot, getPoints, getSize });

onMounted(() => {
  clear(false);
});
</script>

<style scoped>
.touch-box {
  position: relative;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  border: 2px solid #c9d8d0;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
  touch-action: none;
}

.draw-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 46px;
  padding: 8px 10px 8px 14px;
  border-bottom: 1px solid #d8e1db;
  background: #edf5f1;
}

.draw-toolbar strong {
  color: #2d5149;
}

.draw-toolbar span {
  color: #64706c;
  font-size: 0.84rem;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 260px;
  pointer-events: auto;
  touch-action: none;
  cursor: crosshair;
}

@media (max-width: 520px) {
  .draw-toolbar {
    min-height: 40px;
    padding: 6px 10px;
  }

  canvas {
    min-height: 0;
  }
}
</style>
