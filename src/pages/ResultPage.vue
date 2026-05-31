<template>
  <PageContainer>
    <ProgressHeader title="训练结果" label="家属查看" />
    <section v-if="session" class="stack">
      <ResultCard>
        <h2>{{ session.patientNickname }}</h2>
        <p>训练日期：{{ session.date }}</p>
        <p>开始前状态：{{ preStatusText }}</p>
        <p>数学已尝试：{{ answeredMath }} / {{ session.mathQuestions.length }}</p>
        <p>数学正确：{{ correctMath }}</p>
        <p>数学暂未作答：{{ skippedMath }}</p>
        <p>数学总耗时：{{ formatDuration(mathDuration) }}</p>
        <p>数字顺序：{{ session.numberConnectResult?.completed ? '已完成' : '未完成' }}</p>
        <p>重新尝试点击：{{ session.numberConnectResult?.wrongClicks ?? 0 }} 次</p>
        <p>数字顺序耗时：{{ formatDuration(session.numberConnectResult?.durationSeconds) }}</p>
        <p>看图说名称：{{ objectCorrect }} / {{ objectTotal }}</p>
        <p>照着画图形：{{ shapeCopyText }}</p>
        <p>找不同：{{ oddCorrect }} / {{ oddTotal }}</p>
        <p>写名字：{{ writingText }}</p>
        <p>跟唱：{{ singingText }}</p>
        <p>本次总耗时：{{ formatDuration(totalDuration) }}</p>
      </ResultCard>

      <ResultCard>
        <h2>下次设置建议</h2>
        <p v-for="item in suggestions" :key="item">{{ item }}</p>
      </ResultCard>

      <ResultCard>
        <h2>数学逐题记录</h2>
        <div class="question-list">
          <div v-for="(question, index) in session.mathQuestions" :key="question.id" class="question-row">
            <strong>第 {{ index + 1 }} 题：{{ question.expression }} {{ question.correctAnswer }}</strong>
            <span>作答：{{ answerText(question) }}</span>
            <span>情况：{{ questionStatusText(question) }}</span>
            <span>用时：{{ formatDuration(question.timeSpentSeconds) }}</span>
          </div>
        </div>
      </ResultCard>

      <ResultCard>
        <h2>看图说名称记录</h2>
        <div class="question-list">
          <div v-for="(question, index) in session.objectNamingQuestions ?? []" :key="question.id" class="question-row">
            <strong>第 {{ index + 1 }} 题：{{ question.name }}</strong>
            <span>作答：{{ question.userAnswer || '暂未作答' }}</span>
            <span>方式：{{ objectInputText(question.inputMethod) }}</span>
            <span>情况：{{ objectiveStatusText(question.isCorrect, question.skipped) }}</span>
            <span>用时：{{ formatDuration(question.timeSpentSeconds) }}</span>
          </div>
        </div>
      </ResultCard>

      <ResultCard>
        <h2>图形临摹记录</h2>
        <p>图形：{{ session.shapeCopyTask?.shapeName ?? '未记录' }}</p>
        <p>状态：{{ shapeCopyText }}</p>
        <p>重新绘制：{{ session.shapeCopyTask?.redrawCount ?? 0 }} 次</p>
        <p>用时：{{ formatDuration(session.shapeCopyTask?.durationSeconds) }}</p>
      </ResultCard>

      <ResultCard>
        <h2>找不同记录</h2>
        <div class="question-list">
          <div v-for="(question, index) in session.oddOneOutQuestions ?? []" :key="question.id" class="question-row">
            <strong>第 {{ index + 1 }} 题：{{ question.prompt }}</strong>
            <span>正确答案：第 {{ question.answerIndex + 1 }} 个（{{ question.oddLabel }}）</span>
            <span>选择：{{ question.selectedIndex === undefined ? '暂未作答' : `第 ${question.selectedIndex + 1} 个（${question.grid[question.selectedIndex]}）` }}</span>
            <span>情况：{{ objectiveStatusText(question.isCorrect, question.skipped) }}</span>
            <span>用时：{{ formatDuration(question.timeSpentSeconds) }}</span>
          </div>
        </div>
      </ResultCard>

      <ResultCard v-if="isHistoryDetail && !isEditing">
        <h2>家属记录</h2>
        <p>患者状态：{{ moodText }}</p>
        <p>家属备注：{{ session.caregiverNote || '未填写' }}</p>
      </ResultCard>

      <template v-if="isEditing">
        <label>
          患者状态
          <select v-model="mood">
            <option value="calm">平稳</option>
            <option value="happy">愉快</option>
            <option value="tired">疲劳</option>
            <option value="resistant">抵触</option>
            <option value="need_lower_difficulty">需要降低难度</option>
          </select>
        </label>
        <label>
          家属备注
          <textarea v-model="note" rows="4" placeholder="可记录今天是否顺利、是否需要调整。"></textarea>
        </label>
        <AppButton block @click="save">{{ isHistoryDetail ? '保存修改' : '保存每日记录' }}</AppButton>
      </template>

      <template v-else>
        <AppButton block @click="isEditing = true">编辑备注和状态</AppButton>
        <RouterLink to="/history"><AppButton tone="quiet" block>返回历史记录</AppButton></RouterLink>
      </template>
    </section>
    <section v-else class="stack">
      <p>没有找到训练记录。</p>
      <RouterLink to="/history"><AppButton block>返回历史记录</AppButton></RouterLink>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import { useTrainingStore } from '../stores/trainingStore';
import type { MathQuestion, ObjectNamingQuestion, PatientMood, TrainingSession } from '../types';
import { formatDuration } from '../utils/date';
import { buildNextTrainingSuggestions, patientMoodText, preTrainingStatusText } from '../utils/sessionInsights';
import { findSession } from '../utils/storage';

const route = useRoute();
const router = useRouter();
const store = useTrainingStore();
const saved = route.params.id ? findSession(String(route.params.id)) : undefined;
const session = computed<TrainingSession | undefined>(() => saved ?? store.state.currentSession);
const isHistoryDetail = Boolean(route.params.id);
const isEditing = ref(!isHistoryDetail);
const mood = ref<PatientMood>(session.value?.patientMood ?? 'calm');
const note = ref(session.value?.caregiverNote ?? '');

const answeredMath = computed(() => session.value?.mathQuestions.filter((q) => !q.skipped).length ?? 0);
const correctMath = computed(() => session.value?.mathQuestions.filter((q) => q.isCorrect).length ?? 0);
const skippedMath = computed(() => session.value?.mathQuestions.filter((q) => q.skipped).length ?? 0);
const mathDuration = computed(() =>
  session.value?.mathQuestions.reduce((sum, q) => sum + (q.timeSpentSeconds ?? 0), 0) ?? 0,
);
const objectTotal = computed(() => session.value?.objectNamingQuestions?.length ?? 0);
const objectCorrect = computed(() => session.value?.objectNamingQuestions?.filter((q) => q.isCorrect).length ?? 0);
const oddTotal = computed(() => session.value?.oddOneOutQuestions?.length ?? 0);
const oddCorrect = computed(() => session.value?.oddOneOutQuestions?.filter((q) => q.isCorrect).length ?? 0);
const visualDuration = computed(() => {
  const objects = session.value?.objectNamingQuestions?.reduce((sum, q) => sum + (q.timeSpentSeconds ?? 0), 0) ?? 0;
  const shape = session.value?.shapeCopyTask?.durationSeconds ?? 0;
  const odd = session.value?.oddOneOutQuestions?.reduce((sum, q) => sum + (q.timeSpentSeconds ?? 0), 0) ?? 0;
  return objects + shape + odd;
});
const totalDuration = computed(() => {
  if (!session.value?.completedAt) {
    return mathDuration.value + (session.value?.numberConnectResult?.durationSeconds ?? 0) + visualDuration.value;
  }
  return Math.max(
    1,
    Math.round((new Date(session.value.completedAt).getTime() - new Date(session.value.startedAt).getTime()) / 1000),
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
const suggestions = computed(() =>
  session.value ? buildNextTrainingSuggestions({ ...session.value, patientMood: mood.value }) : [],
);
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

function save() {
  if (session.value && isHistoryDetail) {
    store.saveExistingResult(session.value, mood.value, note.value);
  } else {
    store.saveCaregiverResult(mood.value, note.value);
  }
  router.push('/history');
}

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

function objectInputText(method?: ObjectNamingQuestion['inputMethod']): string {
  const map: Record<NonNullable<ObjectNamingQuestion['inputMethod']>, string> = {
    text: '文字输入',
    voice: '语音输入',
    handwriting: '手写辅助',
    skipped: '暂未作答',
  };
  return method ? map[method] : '未记录';
}
</script>

<style scoped>
h2 {
  margin: 0 0 10px;
}

p {
  margin: 9px 0;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 800;
}

select,
textarea {
  border: 1px solid #c9d6cf;
  border-radius: 8px;
  padding: 12px;
  background: #ffffff;
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

.question-row span {
  color: #52615d;
}
</style>
