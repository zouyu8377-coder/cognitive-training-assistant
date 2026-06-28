<template>
  <PageContainer class="drawing-page">
    <ProgressHeader title="写名字" label="触屏书写">
      <template #action>
        <button type="button" @click="choose('skipped')">跳过</button>
      </template>
    </ProgressHeader>

    <section class="task">
      <p>请在下面的手写区写一次自己的名字。</p>
      <DrawingCanvas ref="canvas" inactive-label="手写区" active-label="请写下自己的名字" @draw="hasWriting = true" />
      <p class="message">{{ message || ' ' }}</p>
      <div class="writing-actions">
        <AppButton tone="quiet" block @click="clearCanvas">重写</AppButton>
        <AppButton block @click="completeWriting">手写完成</AppButton>
      </div>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import DrawingCanvas from '../components/DrawingCanvas.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import { useTrainingStore } from '../stores/trainingStore';
import type { TrainingSession } from '../types';
import { nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();
const canvas = ref<InstanceType<typeof DrawingCanvas>>();
const hasWriting = ref(false);
const message = ref('');

function clearCanvas() {
  canvas.value?.clear();
  hasWriting.value = false;
  message.value = '可以重新写。';
}

function choose(status: TrainingSession['writingStatus']) {
  const session = store.ensureSession();
  const writingDataUrl = status === 'completed' && hasWriting.value ? canvas.value?.snapshot() : undefined;
  store.setWritingStatus(status, writingDataUrl);
  router.push(nextTaskRoute(store.state.settings, session));
}

function completeWriting() {
  if (!hasWriting.value) {
    message.value = '请先写几笔，也可以点右上角跳过。';
    return;
  }
  choose('completed');
}
</script>

<style scoped>
.drawing-page {
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.task {
  min-height: calc(100dvh - 92px);
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(300px, 1fr) auto auto;
  gap: 10px;
}

p {
  margin: 0;
  font-size: 1.12rem;
  line-height: 1.45;
}

.message {
  color: #735a1d;
  text-align: center;
  font-size: 0.92rem;
}

.writing-actions {
  position: sticky;
  bottom: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 6px 0 max(6px, env(safe-area-inset-bottom));
  background: var(--color-background);
}

.writing-actions :deep(.app-button) {
  min-height: 68px;
  font-size: 1.12rem;
}

@media (max-width: 520px) {
  .task {
    min-height: calc(100dvh - 72px);
    grid-template-rows: auto minmax(300px, 1fr) auto auto;
    gap: 8px;
  }

  p {
    font-size: 1rem;
    line-height: 1.35;
  }

  .writing-actions {
    gap: 6px;
  }
}
</style>
