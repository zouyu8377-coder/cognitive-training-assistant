<template>
  <PageContainer class="drawing-page">
    <ProgressHeader title="照着画图形" label="看一看，画一画">
      <template #action>
        <button type="button" @click="skip">跳过</button>
      </template>
    </ProgressHeader>

    <section class="drawing-task">
      <ResultCard class="reference-stage">
        <h2>{{ task.referenceImageUrl ? '请照着图片画一遍' : `请照着画一个${task.shapeName}` }}</h2>
        <div class="reference-art">
          <LineArt :kind="task.referenceImageUrl ?? task.shapeKind" :label="task.shapeName" />
        </div>
      </ResultCard>

      <DrawingCanvas ref="canvas" inactive-label="绘图区" active-label="请照着上方图形画" @redraw="redrawCount += 1" />
      <p class="hint">{{ message }}</p>

      <div class="primary-actions">
        <AppButton tone="quiet" block @click="clearCanvas">重画</AppButton>
        <AppButton v-if="!latestAttempt" block @click="completeAttempt">画好了</AppButton>
        <AppButton v-else block @click="saveAndContinue">完成并继续</AppButton>
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
import type { ShapeDrawingAttempt } from '../types';
import { bestShapeAttempt, evaluateShapeDrawing } from '../utils/drawingEvaluation';
import { nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();
const session = store.ensureSession();
const task = session.shapeCopyTask!;
const canvas = ref<InstanceType<typeof DrawingCanvas>>();
const redrawCount = ref(task.redrawCount ?? 0);
const attempts = ref<ShapeDrawingAttempt[]>(task.attempts ?? []);
const latestAttempt = ref<ShapeDrawingAttempt>();
const message = ref('请照着示例，在下面的方框里画一遍。');
const bestAttempt = computed(() => bestShapeAttempt(attempts.value));

function persistDraft(selectedAttemptId?: string, completed = false, skipped = false) {
  const selected = attempts.value.find((attempt) => attempt.id === selectedAttemptId) ?? bestAttempt.value ?? latestAttempt.value;
  store.setShapeCopyTask({
    ...task,
    completed,
    skipped,
    redrawCount: redrawCount.value,
    attempts: attempts.value,
    selectedAttemptId: selectedAttemptId ?? selected?.id,
    drawingDataUrl: selected?.imageDataUrl,
    durationSeconds: selected?.metrics.durationSeconds,
  });
}

function clearCanvas() {
  canvas.value?.clear();
  latestAttempt.value = undefined;
  message.value = '可以重新画。';
}

function completeAttempt() {
  const points = canvas.value?.getPoints() ?? [];
  if (points.length < 6) {
    message.value = '可以先画几笔，再点画好了。';
    return;
  }
  const metrics = evaluateShapeDrawing(task.shapeKind, points);
  const attempt: ShapeDrawingAttempt = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    shapeType: task.shapeKind,
    points,
    imageDataUrl: canvas.value?.snapshot(),
    metrics,
    createdAt: new Date().toISOString(),
  };
  latestAttempt.value = attempt;
  attempts.value = [attempt, ...attempts.value].slice(0, 3);
  persistDraft(bestShapeAttempt(attempts.value)?.id);
  message.value = `${metrics.feedbackText} 可以重画，或完成并继续。`;
}

function saveAndContinue() {
  persistDraft(bestAttempt.value?.id, true, false);
  router.push(nextTaskRoute(store.state.settings, session));
}

function skip() {
  store.setShapeCopyTask({
    ...task,
    completed: false,
    skipped: true,
    redrawCount: redrawCount.value,
    attempts: attempts.value,
    selectedAttemptId: bestAttempt.value?.id,
    drawingDataUrl: bestAttempt.value?.imageDataUrl,
    durationSeconds: bestAttempt.value?.metrics.durationSeconds,
  });
  router.push(nextTaskRoute(store.state.settings, session));
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
  grid-template-rows: minmax(112px, 25svh) minmax(230px, 1fr) auto auto;
  gap: 10px;
}

.reference-stage {
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 6px;
  place-items: center;
  padding: 10px;
  overflow: hidden;
}

.reference-art {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  place-items: center;
}

.reference-art :deep(.object-image),
.reference-art :deep(.line-art) {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  object-fit: contain;
}

h2 {
  margin: 0;
  text-align: center;
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
  background: var(--color-background);
}

.primary-actions :deep(.app-button) {
  min-height: 66px;
  font-size: 1.12rem;
}

@media (max-width: 520px) {
  .drawing-task {
    height: calc(100svh - 72px);
    grid-template-rows: minmax(96px, 21svh) minmax(0, 1fr) auto auto;
    gap: 6px;
  }

  h2 {
    font-size: 1rem;
  }

  .hint {
    min-height: 18px;
    font-size: 0.86rem;
  }

  .primary-actions {
    gap: 6px;
  }
}
</style>
