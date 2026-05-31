<template>
  <PageContainer>
    <ProgressHeader title="训练结果" label="家属查看" />
    <section v-if="session" class="stack">
      <ResultCard>
        <h2>{{ session.patientNickname }}</h2>
        <p>训练日期：{{ session.date }}</p>
        <p>数学完成：{{ completedMath }} / {{ session.mathQuestions.length }}</p>
        <p>数学正确：{{ correctMath }}</p>
        <p>数学跳过：{{ skippedMath }}</p>
        <p>数学总耗时：{{ formatDuration(mathDuration) }}</p>
        <p>数字顺序：{{ session.numberConnectResult?.completed ? '已完成' : '未完成' }}</p>
        <p>错误点击：{{ session.numberConnectResult?.wrongClicks ?? 0 }} 次</p>
        <p>数字顺序耗时：{{ formatDuration(session.numberConnectResult?.durationSeconds) }}</p>
        <p>写名字：{{ writingText }}</p>
        <p>跟唱：{{ singingText }}</p>
        <p>本次总耗时：{{ formatDuration(totalDuration) }}</p>
      </ResultCard>
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
      <AppButton block @click="save">保存每日记录</AppButton>
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
import type { PatientMood, TrainingSession } from '../types';
import { formatDuration } from '../utils/date';
import { findSession } from '../utils/storage';

const route = useRoute();
const router = useRouter();
const store = useTrainingStore();
const saved = route.params.id ? findSession(String(route.params.id)) : undefined;
const session = computed<TrainingSession | undefined>(() => saved ?? store.state.currentSession);
const mood = ref<PatientMood>(session.value?.patientMood ?? 'calm');
const note = ref(session.value?.caregiverNote ?? '');

const completedMath = computed(() => session.value?.mathQuestions.filter((q) => !q.skipped).length ?? 0);
const correctMath = computed(() => session.value?.mathQuestions.filter((q) => q.isCorrect).length ?? 0);
const skippedMath = computed(() => session.value?.mathQuestions.filter((q) => q.skipped).length ?? 0);
const mathDuration = computed(() =>
  session.value?.mathQuestions.reduce((sum, q) => sum + (q.timeSpentSeconds ?? 0), 0) ?? 0,
);
const totalDuration = computed(() => {
  if (!session.value?.completedAt) return mathDuration.value + (session.value?.numberConnectResult?.durationSeconds ?? 0);
  return Math.max(1, Math.round((new Date(session.value.completedAt).getTime() - new Date(session.value.startedAt).getTime()) / 1000));
});
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
  store.saveCaregiverResult(mood.value, note.value);
  router.push('/history');
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
</style>
