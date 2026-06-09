<template>
  <PageContainer>
    <ProgressHeader title="家属结果" label="按日期查看" />
    <section class="stack">
      <label class="date-picker">
        选择日期
        <input v-model="selectedDate" type="date" />
      </label>

      <ResultCard v-for="item in selectedDateSessions" :key="item.id">
        <RouterLink class="record" :to="`/result/${item.id}`">
          <strong>{{ item.date }}</strong>
          <span>时间：{{ sessionTimeText(item) }}</span>
          <span>{{ item.completedAt ? '已完成' : '未完成' }}</span>
          <span>数学正确：{{ correctCount(item) }} / {{ item.mathQuestions.length }}</span>
          <span>数字顺序：{{ item.numberConnectResult?.completed ? '已完成' : '未完成' }}</span>
          <span>状态：{{ moodText(item.patientMood) }}</span>
        </RouterLink>
      </ResultCard>
      <p v-if="selectedDateSessions.length === 0" class="muted">这一天还没有保存的训练记录。</p>

      <ResultCard v-for="item in recentSessions" :key="item.id">
        <RouterLink class="record" :to="`/result/${item.id}`">
          <strong>{{ item.date }}</strong>
          <span>时间：{{ sessionTimeText(item) }}</span>
          <span>{{ item.completedAt ? '已完成' : '未完成' }}</span>
          <span>数学正确：{{ correctCount(item) }} / {{ item.mathQuestions.length }}</span>
          <span>数字顺序：{{ item.numberConnectResult?.completed ? '已完成' : '未完成' }}</span>
          <span>状态：{{ moodText(item.patientMood) }}</span>
        </RouterLink>
      </ResultCard>

      <p v-if="sessions.length === 0" class="muted">还没有保存的训练记录。</p>
      <RouterLink to="/"><AppButton tone="quiet" block>返回首页</AppButton></RouterLink>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import type { PatientMood, TrainingSession } from '../types';
import { todayKey } from '../utils/date';
import { loadSessions } from '../utils/storage';

const sessions = loadSessions().sort((a, b) => b.date.localeCompare(a.date));
const selectedDate = ref(sessions[0]?.date ?? todayKey());
const selectedDateSessions = computed(() => sessions.filter((session) => session.date === selectedDate.value));
const recentSessions = computed(() => sessions.filter((session) => session.date !== selectedDate.value).slice(0, 6));

function correctCount(item: TrainingSession) {
  return item.mathQuestions.filter((question) => question.isCorrect).length;
}

function sessionTimeText(item: TrainingSession): string {
  return new Date(item.completedAt ?? item.startedAt).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function moodText(mood?: PatientMood) {
  const map: Record<PatientMood, string> = {
    calm: '平稳',
    happy: '愉快',
    tired: '疲劳',
    resistant: '抵触',
    need_lower_difficulty: '需要降低难度',
  };
  return mood ? map[mood] : '未记录';
}
</script>

<style scoped>
.date-picker {
  display: grid;
  gap: 8px;
  font-weight: 800;
}

.date-picker input {
  min-height: 48px;
  border: 1px solid #c9d6cf;
  border-radius: 8px;
  padding: 9px 12px;
  background: #ffffff;
}

.record {
  display: grid;
  gap: 8px;
  text-decoration: none;
}

strong {
  font-size: 1.18rem;
}

span {
  color: #52615d;
}
</style>
