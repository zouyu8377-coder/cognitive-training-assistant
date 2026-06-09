<template>
  <PageContainer>
    <ProgressHeader title="写名字" label="触屏书写" />
    <section class="task stack">
      <p>请在下面的手写区写一次自己的名字。写完后点击“已完成”。</p>
      <DrawingCanvas ref="canvas" inactive-label="手写区" active-label="正在手写" @draw="hasWriting = true" />
      <div class="writing-actions">
        <AppButton tone="quiet" block @click="clearCanvas">清空重写</AppButton>
        <AppButton block @click="choose('completed')">已完成</AppButton>
        <AppButton tone="secondary" block @click="choose('skipped')">今天不想做</AppButton>
        <AppButton tone="quiet" block @click="choose('help_needed')">需要帮助</AppButton>
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

function clearCanvas() {
  canvas.value?.clear();
  hasWriting.value = false;
}

function choose(status: TrainingSession['writingStatus']) {
  const session = store.ensureSession();
  const writingDataUrl = status === 'completed' && hasWriting.value ? canvas.value?.snapshot() : undefined;
  store.setWritingStatus(status, writingDataUrl);
  router.push(nextTaskRoute(store.state.settings, session));
}
</script>

<style scoped>
.task {
  min-height: calc(100svh - 116px);
  align-content: start;
}

p {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.55;
}

.writing-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

@media (max-width: 520px) {
  .task {
    min-height: calc(100svh - 72px);
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
