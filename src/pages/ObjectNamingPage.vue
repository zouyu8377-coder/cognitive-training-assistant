<template>
  <PageContainer class="drawing-page">
    <ProgressHeader :title="`看图写名称 ${currentIndex + 1}/${questions.length}`" label="看一看，写一写">
      <template #action>
        <button type="button" :disabled="waiting || imageLoading" @click="skip">跳过</button>
      </template>
    </ProgressHeader>

    <section class="drawing-task">
      <ResultCard class="image-stage">
        <div v-if="imageLoading" class="image-loading" role="status">
          <span class="spinner"></span>
          <strong>正在加载下一张图...</strong>
        </div>
        <LineArt
          :key="current.id"
          :class="{ 'image-hidden': imageLoading }"
          :kind="current.icon"
          :label="current.name"
          fit-parent
          @load="imageReady"
          @error="imageFailed"
        />
      </ResultCard>

      <DrawingCanvas ref="canvas" inactive-label="手写区" active-label="请写下图片名称" @draw="hasDrawing = true" />
      <p class="hint">{{ message }}</p>
      <div class="primary-actions">
        <AppButton tone="quiet" :disabled="waiting" @click="rewrite">重写</AppButton>
        <AppButton :disabled="waiting" @click="submitHandwriting">手写完成</AppButton>
      </div>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import DrawingCanvas from '../components/DrawingCanvas.vue';
import LineArt from '../components/LineArt.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import { useTrainingStore } from '../stores/trainingStore';
import { firstPendingObjectIndex, nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();
const session = store.ensureSession();
const questions = session.objectNamingQuestions ?? [];
const currentIndex = ref(firstPendingObjectIndex(session));
const canvas = ref<InstanceType<typeof DrawingCanvas>>();
const hasDrawing = ref(false);
const message = ref('正在加载图片...');
const waiting = ref(false);
const imageLoading = ref(true);
const startedAt = ref(Date.now());
const current = computed(() => questions[currentIndex.value]);

function recordHandwriting(skipped: boolean) {
  store.setObjectNamingQuestion(currentIndex.value, {
    ...current.value,
    userAnswer: undefined,
    inputMethod: skipped ? 'skipped' : 'handwriting',
    drawingDataUrl: skipped ? undefined : canvas.value?.snapshot(),
    isCorrect: undefined,
    skipped,
    timeSpentSeconds: Math.max(1, Math.round((Date.now() - startedAt.value) / 1000)),
  });
}

function moveOn() {
  if (currentIndex.value >= questions.length - 1) {
    router.push(nextTaskRoute(store.state.settings, session));
    return;
  }
  imageLoading.value = true;
  message.value = '正在加载下一张图...';
  currentIndex.value += 1;
  hasDrawing.value = false;
  canvas.value?.clear(false);
  startedAt.value = Date.now();
}

function submitHandwriting() {
  if (!hasDrawing.value) {
    message.value = '请先写几笔，也可以点右上角跳过。';
    return;
  }
  recordHandwriting(false);
  waiting.value = true;
  message.value = '写好啦，正在准备下一题。';
  window.setTimeout(() => {
    waiting.value = false;
    moveOn();
  }, 650);
}

function rewrite() {
  canvas.value?.clear();
  hasDrawing.value = false;
  message.value = '可以重新写。';
}

function skip() {
  recordHandwriting(true);
  moveOn();
}

function imageReady() {
  imageLoading.value = false;
  message.value = '请在下方写出图片名称。';
}

function imageFailed() {
  imageLoading.value = false;
  message.value = '图片暂时没有加载出来，可以点右上角跳过。';
}
</script>

<style scoped>
.drawing-page {
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.drawing-task {
  min-height: calc(100dvh - 92px);
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(108px, 23dvh) minmax(240px, 1fr) auto auto;
  gap: 10px;
}

.image-stage {
  position: relative;
  min-height: 0;
  display: grid;
  place-items: center;
  padding: 10px;
  overflow: hidden;
}

.image-stage :deep(.object-image.fit-parent),
.image-stage :deep(.line-art.fit-parent) {
  position: absolute;
  inset: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  object-fit: contain;
}

.image-hidden {
  opacity: 0;
}

.image-loading {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  color: #52615d;
  background: #fffdf7;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #d8e1db;
  border-top-color: #2f6f61;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.hint {
  min-height: 22px;
  margin: 0;
  color: #52615d;
  text-align: center;
  font-size: clamp(0.92rem, 4vw, 1.25rem);
  line-height: 1.35;
}

.primary-actions {
  position: sticky;
  bottom: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 6px 0 max(6px, env(safe-area-inset-bottom));
  background: var(--color-background);
}

.primary-actions :deep(.app-button) {
  min-height: 66px;
  font-size: 1.12rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 520px) {
  .drawing-task {
    min-height: calc(100dvh - 72px);
    grid-template-rows: minmax(96px, 19dvh) minmax(260px, 1fr) auto auto;
    gap: 8px;
  }

  .primary-actions {
    gap: 6px;
  }

  .hint {
    min-height: 0;
    font-size: clamp(0.9rem, 4.6vw, 1.2rem);
  }
}
</style>
