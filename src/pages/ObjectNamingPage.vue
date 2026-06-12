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
  height: 100svh;
  overflow: hidden;
}

.drawing-task {
  height: calc(100svh - 92px);
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(100px, 24svh) minmax(230px, 1fr) auto auto;
  gap: 10px;
}

.image-stage {
  position: relative;
  min-height: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.image-stage :deep(.object-image),
.image-stage :deep(.line-art) {
  max-height: 100%;
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
  min-height: 24px;
  margin: 0;
  color: #52615d;
  text-align: center;
}

.primary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-bottom: max(2px, env(safe-area-inset-bottom));
  background: #f7f5ef;
}

.primary-actions :deep(.app-button) {
  min-height: 62px;
  font-size: 1.12rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 520px) {
  .drawing-task {
    height: calc(100svh - 72px);
    grid-template-rows: minmax(88px, 20svh) minmax(0, 1fr) auto auto;
    gap: 6px;
  }

  .primary-actions {
    gap: 6px;
  }

  .hint {
    min-height: 18px;
    font-size: 0.86rem;
  }
}
</style>
