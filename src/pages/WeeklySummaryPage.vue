<template>
  <PageContainer>
    <ProgressHeader title="周度复盘" label="最近 7 天" />
    <section class="stack">
      <ResultCard>
        <p>训练次数：{{ recent.length }}</p>
        <p>平均数学正确率：{{ averageAccuracy }}%</p>
        <p>数字顺序完成次数：{{ connectCompleted }}</p>
        <p>需关注状态次数：{{ pressureMoodCount }}</p>
      </ResultCard>
      <ResultCard>
        <h2>简单提示</h2>
        <p>{{ suggestion }}</p>
      </ResultCard>
      <RouterLink to="/history"><AppButton block>返回历史记录</AppButton></RouterLink>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import { loadSessions } from '../utils/storage';

const now = new Date();
const sevenDaysAgo = new Date(now);
sevenDaysAgo.setDate(now.getDate() - 6);

const recent = loadSessions().filter((session) => new Date(`${session.date}T00:00:00`) >= sevenDaysAgo);
const totalQuestions = computed(() => recent.reduce((sum, item) => sum + item.mathQuestions.length, 0));
const correctQuestions = computed(() =>
  recent.reduce((sum, item) => sum + item.mathQuestions.filter((question) => question.isCorrect).length, 0),
);
const averageAccuracy = computed(() =>
  totalQuestions.value ? Math.round((correctQuestions.value / totalQuestions.value) * 100) : 0,
);
const connectCompleted = computed(() => recent.filter((item) => item.numberConnectResult?.completed).length);
const pressureMoodCount = computed(
  () =>
    recent.filter((item) =>
      ['tired', 'resistant', 'need_lower_difficulty'].includes(item.patientMood ?? ''),
    ).length,
);
const suggestion = computed(() => {
  if (recent.length === 0) return '最近还没有记录。可以先从较少题量开始，完成一次简单练习。';
  if (pressureMoodCount.value > 0) {
    return '最近记录中，减法或较难题目可能带来压力。下次可以适当降低难度，以完成和保持参与意愿为主。';
  }
  return '最近记录较平稳。可以继续保持短时间、低压力的练习节奏。';
});
</script>

<style scoped>
p {
  margin: 10px 0;
  font-size: 1.08rem;
}

h2 {
  margin: 0 0 10px;
}
</style>
