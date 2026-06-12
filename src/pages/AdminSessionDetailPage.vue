<template>
  <PageContainer>
    <ProgressHeader title="训练详情" label="管理员查看" />

    <p v-if="loading" class="state">正在加载详细记录...</p>
    <p v-else-if="errorMessage" class="state error">{{ errorMessage }}</p>

    <section v-else-if="session" class="stack">
      <ResultCard>
        <div class="detail-heading">
          <div>
            <h2>{{ session.patientNickname }}</h2>
            <p>训练日期：{{ session.date }}</p>
          </div>
          <span class="status">{{ cloudSession?.status === 'completed' ? '已完成' : '进行中' }}</span>
        </div>
        <p>开始前状态：{{ preStatusText }}</p>
        <p>数学已尝试：{{ answeredMath }} / {{ session.mathQuestions.length }}</p>
        <p>数学正确：{{ correctMath }}</p>
        <p>数学暂未作答：{{ skippedMath }}</p>
        <p>数学总耗时：{{ formatDuration(mathDuration) }}</p>
        <p>数字顺序：{{ session.numberConnectResult?.completed ? '已完成' : '未完成' }}</p>
        <p>重新尝试点击：{{ session.numberConnectResult?.wrongClicks ?? 0 }} 次</p>
        <p>数字顺序耗时：{{ formatDuration(session.numberConnectResult?.durationSeconds) }}</p>
        <p>看图写名称：{{ objectCompleted }} / {{ objectTotal }}</p>
        <p>照着画图形：{{ shapeCopyText }}</p>
        <p>找不同：{{ oddCorrect }} / {{ oddTotal }}</p>
        <p>写名字：{{ writingText }}</p>
        <img v-if="session.writingDataUrl" class="drawing-preview" :src="session.writingDataUrl" alt="手写名字记录" />
        <p>跟唱：{{ singingText }}</p>
        <p>本次总耗时：{{ formatDuration(totalDuration) }}</p>
      </ResultCard>

      <ResultCard>
        <h2>下次设置建议</h2>
        <p v-for="item in suggestions" :key="item">{{ item }}</p>
      </ResultCard>

      <ResultCard>
        <h2>数学逐题记录</h2>
        <div v-if="session.mathQuestions.length" class="question-list">
          <div v-for="(question, index) in session.mathQuestions" :key="question.id" class="question-row">
            <strong>第 {{ index + 1 }} 题：{{ question.expression }} {{ question.correctAnswer }}</strong>
            <span>作答：{{ answerText(question) }}</span>
            <span>情况：{{ questionStatusText(question) }}</span>
            <span>用时：{{ formatDuration(question.timeSpentSeconds) }}</span>
          </div>
        </div>
        <p v-else class="muted">没有数学逐题记录。</p>
      </ResultCard>

      <ResultCard>
        <h2>看图写名称记录</h2>
        <div v-if="objectTotal" class="question-list">
          <div v-for="(question, index) in session.objectNamingQuestions ?? []" :key="question.id" class="question-row">
            <strong>第 {{ index + 1 }} 题：{{ question.name }}</strong>
            <span>方式：{{ objectInputText(question.inputMethod) }}</span>
            <span>情况：{{ question.skipped ? '暂未作答' : question.drawingDataUrl ? '已完成' : '未记录' }}</span>
            <span>用时：{{ formatDuration(question.timeSpentSeconds) }}</span>
            <img v-if="question.drawingDataUrl" class="drawing-preview" :src="question.drawingDataUrl" alt="手写记录" />
          </div>
        </div>
        <p v-else class="muted">没有看图写名称记录。</p>
      </ResultCard>

      <ResultCard>
        <h2>图形临摹记录</h2>
        <p>图形：{{ session.shapeCopyTask?.shapeName ?? '未记录' }}</p>
        <p>状态：{{ shapeCopyText }}</p>
        <p>尝试次数：{{ shapeAttemptCount }}</p>
        <p>重新绘制：{{ session.shapeCopyTask?.redrawCount ?? 0 }} 次</p>
        <p>用时：{{ formatDuration(session.shapeCopyTask?.durationSeconds) }}</p>
        <p v-if="bestShapeAttempt">表现最好一次：{{ drawingLevelText(bestShapeAttempt.metrics.level) }}</p>
        <p v-if="bestShapeAttempt">实际评分：{{ bestShapeAttempt.metrics.score }} / 100</p>
        <p v-if="bestShapeAttempt">笔画数：{{ bestShapeAttempt.metrics.strokeCount }}</p>
        <p v-if="bestShapeAttempt">轨迹点数：{{ bestShapeAttempt.metrics.pointCount }}</p>
        <p v-if="bestShapeAttempt">覆盖度：{{ percentText(bestShapeAttempt.metrics.coverageRate) }}</p>
        <p v-if="bestShapeAttempt">贴近度：{{ percentText(bestShapeAttempt.metrics.precisionRate) }}</p>
        <p v-if="bestShapeAttempt">闭合度：{{ percentText(bestShapeAttempt.metrics.closureRate) }}</p>
        <p v-if="bestShapeAttempt">{{ bestShapeAttempt.metrics.caregiverText }}</p>
        <p class="muted">图形结果仅用于家庭训练记录和完成度参考，不代表医学评估结果。</p>
        <img v-if="bestShapeAttempt?.imageDataUrl" class="drawing-preview" :src="bestShapeAttempt.imageDataUrl" alt="表现最好一次" />
      </ResultCard>

      <ResultCard>
        <h2>找不同记录</h2>
        <div v-if="oddTotal" class="question-list">
          <div v-for="(question, index) in session.oddOneOutQuestions ?? []" :key="question.id" class="question-row">
            <strong>第 {{ index + 1 }} 题：{{ question.prompt }}</strong>
            <span>正确答案：第 {{ question.answerIndex + 1 }} 个（{{ question.oddLabel }}）</span>
            <span>选择：{{ selectedOddAnswer(question) }}</span>
            <span>情况：{{ objectiveStatusText(question.isCorrect, question.skipped) }}</span>
            <span>用时：{{ formatDuration(question.timeSpentSeconds) }}</span>
          </div>
        </div>
        <p v-else class="muted">没有找不同记录。</p>
      </ResultCard>

      <ResultCard>
        <h2>家属记录</h2>
        <p>患者状态：{{ moodText }}</p>
        <p>家属备注：{{ session.caregiverNote || '未填写' }}</p>
      </ResultCard>

      <RouterLink to="/admin"><AppButton tone="quiet" block>返回管理员记录</AppButton></RouterLink>
    </section>

    <section v-else class="stack">
      <p>没有找到训练记录，记录可能已超出最近 100 条的保留范围。</p>
      <RouterLink to="/admin"><AppButton block>返回管理员记录</AppButton></RouterLink>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import type { AdminTrainingSession } from '../services/cloudTracking';
import {
  getCurrentSession,
  isCurrentUserAdmin,
  loadAdminTrainingSession,
} from '../services/cloudTracking';
import type { MathQuestion, ObjectNamingQuestion, OddOneOutQuestion, TrainingSession } from '../types';
import { formatDuration } from '../utils/date';
import { bestShapeAttempt as getBestShapeAttempt } from '../utils/drawingEvaluation';
import { buildNextTrainingSuggestions, patientMoodText, preTrainingStatusText } from '../utils/sessionInsights';

const route = useRoute();
const router = useRouter();
const cloudSession = ref<AdminTrainingSession>();
const loading = ref(true);
const errorMessage = ref('');
const session = computed<TrainingSession | undefined>(() => cloudSession.value?.result_data);

const answeredMath = computed(() => session.value?.mathQuestions.filter((q) => !q.skipped).length ?? 0);
const correctMath = computed(() => session.value?.mathQuestions.filter((q) => q.isCorrect).length ?? 0);
const skippedMath = computed(() => session.value?.mathQuestions.filter((q) => q.skipped).length ?? 0);
const mathDuration = computed(() =>
  session.value?.mathQuestions.reduce((sum, q) => sum + (q.timeSpentSeconds ?? 0), 0) ?? 0,
);
const objectTotal = computed(() => session.value?.objectNamingQuestions?.length ?? 0);
const objectCompleted = computed(
  () => session.value?.objectNamingQuestions?.filter((q) => q.drawingDataUrl || q.inputMethod === 'handwriting').length ?? 0,
);
const oddTotal = computed(() => session.value?.oddOneOutQuestions?.length ?? 0);
const oddCorrect = computed(() => session.value?.oddOneOutQuestions?.filter((q) => q.isCorrect).length ?? 0);
const totalDuration = computed(() => {
  if (!session.value) return 0;
  if (session.value.completedAt) {
    return Math.max(
      1,
      Math.round((new Date(session.value.completedAt).getTime() - new Date(session.value.startedAt).getTime()) / 1000),
    );
  }
  const objectDuration =
    session.value.objectNamingQuestions?.reduce((sum, q) => sum + (q.timeSpentSeconds ?? 0), 0) ?? 0;
  const oddDuration =
    session.value.oddOneOutQuestions?.reduce((sum, q) => sum + (q.timeSpentSeconds ?? 0), 0) ?? 0;
  return (
    mathDuration.value +
    (session.value.numberConnectResult?.durationSeconds ?? 0) +
    objectDuration +
    (session.value.shapeCopyTask?.durationSeconds ?? 0) +
    oddDuration
  );
});
const preStatusText = computed(() =>
  session.value?.preTrainingStatus ? preTrainingStatusText[session.value.preTrainingStatus] : '未记录',
);
const moodText = computed(() => (session.value?.patientMood ? patientMoodText[session.value.patientMood] : '未记录'));
const shapeCopyText = computed(() => {
  if (session.value?.shapeCopyTask?.completed) return '已完成';
  if (session.value?.shapeCopyTask?.skipped) return '今天先不画';
  return '未记录';
});
const shapeAttemptCount = computed(() => session.value?.shapeCopyTask?.attempts?.length ?? 0);
const bestShapeAttempt = computed(() => getBestShapeAttempt(session.value?.shapeCopyTask?.attempts));
const suggestions = computed(() => (session.value ? buildNextTrainingSuggestions(session.value) : []));
const writingText = computed(() => {
  const map = { completed: '已完成', skipped: '今天不想做', help_needed: '需要家属帮助' };
  return session.value?.writingStatus ? map[session.value.writingStatus] : '未设置';
});
const singingText = computed(() => {
  const map = {
    completed_good: '已完成，状态不错',
    completed_tired: '已完成，但有些疲劳',
    skipped: '今天不想做',
    not_done: '未进行',
  };
  return session.value?.singingStatus ? map[session.value.singingStatus] : '未设置';
});

onMounted(async () => {
  try {
    const authSession = await getCurrentSession();
    if (!authSession || !(await isCurrentUserAdmin())) {
      await router.replace('/admin/login');
      return;
    }
    cloudSession.value = await loadAdminTrainingSession(String(route.params.id));
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败';
  } finally {
    loading.value = false;
  }
});

function answerText(question: MathQuestion): string {
  if (question.skipped) return '暂未作答';
  return question.userAnswer === undefined ? '未记录' : String(question.userAnswer);
}

function questionStatusText(question: MathQuestion): string {
  if (question.skipped) return '暂未作答';
  if (question.isCorrect) return '正确';
  if (question.userAnswer === undefined) return '未记录';
  return '需家属查看';
}

function objectiveStatusText(isCorrect?: boolean, skipped?: boolean): string {
  if (skipped) return '暂未作答';
  if (isCorrect) return '正确';
  if (isCorrect === false) return '需家属查看';
  return '未记录';
}

function selectedOddAnswer(question: OddOneOutQuestion): string {
  if (question.selectedIndex === undefined) return '暂未作答';
  return `第 ${question.selectedIndex + 1} 个（${question.grid[question.selectedIndex] ?? '未记录'}）`;
}

function objectInputText(method?: ObjectNamingQuestion['inputMethod']): string {
  const map: Record<NonNullable<ObjectNamingQuestion['inputMethod']>, string> = {
    voice: '语音输入',
    handwriting: '手写辅助',
    skipped: '暂未作答',
  };
  return method ? map[method] : '未记录';
}

function percentText(value?: number): string {
  return value === undefined ? '未记录' : `${Math.round(value * 100)}%`;
}

function drawingLevelText(level: string): string {
  const map: Record<string, string> = {
    excellent: '完成较完整',
    good: '完成不错',
    completed: '已完成',
    try_again: '已尝试完成',
  };
  return map[level] ?? '已记录';
}
</script>

<style scoped>
h2 {
  margin: 0 0 10px;
}

p {
  margin: 9px 0;
}

.detail-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.status {
  flex: 0 0 auto;
  padding: 5px 9px;
  border-radius: 6px;
  background: #e9f3ed;
  color: #29614e;
  font-size: 0.82rem;
  font-weight: 800;
}

.question-list {
  display: grid;
  gap: 12px;
}

.question-row {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid #d8e1db;
  border-radius: 8px;
  background: #ffffff;
}

.question-row span,
.muted {
  color: #52615d;
}

.drawing-preview {
  width: 100%;
  max-height: 260px;
  object-fit: contain;
  border: 1px solid #d8e1db;
  border-radius: 8px;
  background: #ffffff;
}

.state {
  padding: 28px 0;
  color: #64706c;
  text-align: center;
}

.error {
  color: #9b2c2c;
}
</style>
