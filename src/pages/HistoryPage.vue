<template>
  <PageContainer>
    <ProgressHeader title="家属结果" label="按日期查看" />
    <section class="stack">
      <div class="history-intro">
        <h1>练习记录</h1>
        <p>选择日期，查看每次练习的完成情况和详细答题记录。</p>
      </div>
      <label class="date-picker">
        <span>选择日期</span>
        <input v-model="selectedDate" type="date" />
      </label>

      <ResultCard v-for="item in selectedDateSessions" :key="item.id" class="record-card">
        <RouterLink class="record" :to="`/result/${item.id}`">
          <div class="record-heading">
            <div><strong>{{ sessionTimeText(item) }}</strong><small>{{ item.date }}</small></div>
            <span class="status" :class="{ done: item.completedAt }">{{ item.completedAt ? '已完成' : '未完成' }}</span>
          </div>
          <div class="record-stats">
            <span><b>{{ correctCount(item) }}/{{ item.mathQuestions.length }}</b> 数学正确</span>
            <span><b>{{ item.numberConnectResult?.completed ? '完成' : '未完成' }}</b> 数字顺序</span>
            <span><b>{{ moodText(item.patientMood) }}</b> 当天状态</span>
          </div>
          <span class="view-detail">查看详细记录 →</span>
        </RouterLink>
      </ResultCard>
      <p v-if="selectedDateSessions.length === 0" class="muted">这一天还没有保存的训练记录。</p>

      <h2 v-if="recentSessions.length" class="recent-title">更早的记录</h2>
      <ResultCard v-for="item in recentSessions" :key="item.id" class="record-card compact-record">
        <RouterLink class="record" :to="`/result/${item.id}`">
          <div class="record-heading">
            <div><strong>{{ item.date }}</strong><small>{{ sessionTimeText(item) }}</small></div>
            <span class="status" :class="{ done: item.completedAt }">{{ item.completedAt ? '已完成' : '未完成' }}</span>
          </div>
          <span>数学正确：{{ correctCount(item) }} / {{ item.mathQuestions.length }}</span>
          <span class="view-detail">查看详情 →</span>
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
.history-intro h1 {
  margin: 0;
  font-size: 1.55rem;
}

.history-intro p {
  margin: 8px 0 0;
  color: var(--color-muted);
  line-height: 1.6;
}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font-weight: 800;
}

.date-picker input {
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 9px 12px;
  background: #ffffff;
}

.record {
  display: grid;
  gap: 12px;
  text-decoration: none;
}

.record-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.record-heading div {
  display: grid;
  gap: 4px;
}

.record-heading strong {
  font-size: 1.2rem;
}

.record-heading small {
  color: var(--color-muted);
}

.status {
  padding: 5px 9px;
  border-radius: 6px;
  color: #8a641d;
  background: #fff4d8;
  font-size: 0.8rem;
  font-weight: 800;
}

.status.done {
  color: #226c4d;
  background: #e8f5ed;
}

.record-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.record-stats span {
  display: grid;
  gap: 3px;
  padding: 10px 6px;
  border-radius: 6px;
  background: #f2f5f2;
  text-align: center;
  font-size: 0.78rem;
}

.record-stats b {
  color: var(--color-text);
  font-size: 0.95rem;
}

span {
  color: var(--color-muted);
}

.view-detail {
  color: var(--color-primary);
  font-weight: 800;
  text-align: right;
}

.recent-title {
  margin: 8px 0 0;
  font-size: 1.05rem;
}

@media (max-width: 380px) {
  .record-stats {
    grid-template-columns: 1fr;
  }
}
</style>
