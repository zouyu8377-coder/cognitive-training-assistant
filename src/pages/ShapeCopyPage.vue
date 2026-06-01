<template>
  <PageContainer>
    <ProgressHeader title="照着画图形" label="看一看，画一画" />
    <section class="stack">
      <ResultCard>
        <h2>请照着画一个{{ task.shapeName }}</h2>
        <LineArt :kind="task.shapeKind" :label="task.shapeName" />
      </ResultCard>
      <DrawingCanvas ref="canvas" @redraw="redrawCount += 1" />
      <p class="hint">{{ message }}</p>
      <AppButton tone="quiet" block @click="clearCanvas">重新绘制</AppButton>
      <AppButton block @click="finish(true)">已完成</AppButton>
      <AppButton tone="secondary" block @click="finish(false)">今天先不画</AppButton>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import DrawingCanvas from '../components/DrawingCanvas.vue';
import LineArt from '../components/LineArt.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import { useTrainingStore } from '../stores/trainingStore';
import { nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();
const session = store.ensureSession();
const task = session.shapeCopyTask!;
const canvas = ref<InstanceType<typeof DrawingCanvas>>();
const startedAt = Date.now();
const redrawCount = ref(task.redrawCount ?? 0);
const message = ref('照着上面的图形，在空白区画一画。');

function clearCanvas() {
  canvas.value?.clear();
  message.value = '可以重新画。';
}

function finish(completed: boolean) {
  store.setShapeCopyTask({
    ...task,
    completed,
    skipped: !completed,
    redrawCount: redrawCount.value,
    drawingDataUrl: completed ? canvas.value?.snapshot() : undefined,
    durationSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
  });
  message.value = completed ? '画得很好，完成啦。' : '今天先放一放也可以。';
  router.push(nextTaskRoute(store.state.settings, session));
}
</script>

<style scoped>
h2 {
  margin: 0 0 12px;
  text-align: center;
}

.hint {
  color: #52615d;
}
</style>
