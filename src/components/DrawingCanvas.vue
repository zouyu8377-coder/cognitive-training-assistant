<template>
  <div class="touch-box">
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

const emit = defineEmits<{ redraw: [] }>();
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

function clear(shouldEmit = true) {
  const ctx = context();
  if (canvas.value) ctx?.clearRect(0, 0, canvas.value.width, canvas.value.height);
  if (shouldEmit) emit('redraw');
}

defineExpose({ clear });

onMounted(() => {
  clear(false);
});
</script>

<style scoped>
.touch-box {
  border: 2px dashed #b8c8bf;
  border-radius: 8px;
  background: #ffffff;
}

canvas {
  display: block;
  width: 100%;
  height: 240px;
  touch-action: none;
}
</style>
