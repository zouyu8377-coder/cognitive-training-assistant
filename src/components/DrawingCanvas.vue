<template>
  <div class="touch-box" :class="{ active: drawingEnabled }">
    <div class="draw-toolbar">
      <strong>{{ drawingEnabled ? activeLabel : inactiveLabel }}</strong>
      <button class="draw-toggle" type="button" @click="drawingEnabled = !drawingEnabled">
        {{ drawingEnabled ? '暂停' : '开启' }}
      </button>
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
    <p class="draw-hint">
      {{ drawingEnabled ? '触屏书写中；点暂停后可以滑动页面。' : '鼠标可直接书写；触屏请先点开启，避免滑动时误画。' }}
    </p>
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
const drawingEnabled = ref(false);
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
  if (event.pointerType !== 'mouse' && !drawingEnabled.value) return;
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
  if (shouldEmit) drawingEnabled.value = true;
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
  border: 2px dashed #b8c8bf;
  border-radius: 8px;
  background: #ffffff;
  touch-action: pan-y;
}

.draw-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 48px;
  padding: 8px 10px 8px 14px;
  border-bottom: 1px solid #d8e1db;
  background: #eef4ef;
}

.draw-toolbar strong {
  color: #2d5149;
}

.draw-toggle {
  min-width: 72px;
  min-height: 44px;
  border: 1px solid #c8d5cc;
  border-radius: 8px;
  background: #ffffff;
  color: #2d5149;
  font-weight: 800;
}

.touch-box.active .draw-toolbar {
  background: #2f6f61;
}

.touch-box.active .draw-toolbar strong {
  color: #ffffff;
}

canvas {
  display: block;
  width: 100%;
  height: clamp(190px, 32svh, 240px);
  pointer-events: auto;
  touch-action: pan-y;
  cursor: crosshair;
}

.active canvas {
  touch-action: none;
}

.draw-hint {
  margin: 0;
  padding: 8px 12px 10px;
  border-top: 1px solid #eef1ed;
  color: #64706c;
  font-size: 0.9rem;
  line-height: 1.45;
}
</style>
