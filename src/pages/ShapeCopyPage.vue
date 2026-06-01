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

      <ResultCard v-if="latestAttempt">
        <h2>这次画完啦</h2>
        <p>{{ latestAttempt.metrics.feedbackText }}</p>
        <p class="muted">已经尝试 {{ attempts.length }} 次。{{ bestSavedMessage }}</p>
      </ResultCard>

      <div class="primary-actions">
        <AppButton tone="quiet" block @click="clearCanvas">清空重画</AppButton>
        <AppButton block @click="completeAttempt">完成</AppButton>
      </div>
      <AppButton v-if="latestAttempt" block @click="saveAndContinue">保存并继续</AppButton>
      <AppButton tone="secondary" block @click="skip">今天先不画</AppButton>
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
const bestSavedMessage = computed(() =>
  latestAttempt.value?.id === bestAttempt.value?.id ? '这次已经作为当前最好结果保存。' : '当前保留表现更好的一次。',
);

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
    message.value = '可以先画几笔，再点完成。';
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
  const selected = bestShapeAttempt(attempts.value);
  persistDraft(selected?.id);
  message.value = metrics.feedbackText;
}

function saveAndContinue() {
  persistDraft(bestAttempt.value?.id, true, false);
  message.value = '已保存本次练习。';
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
  message.value = '今天先放一放也可以。';
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

.primary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
</style>
