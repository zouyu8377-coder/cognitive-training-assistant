<template>
  <PageContainer>
    <ProgressHeader title="今日训练" label="准备开始" />
    <section class="stack">
      <ResultCard>
        <h2>{{ store.state.settings.patientNickname || '家人' }}，今天有这些练习</h2>
        <ul>
          <li>数学练习：{{ store.state.settings.mathQuestionCount }} 题</li>
          <li>数字顺序练习：1-{{ store.state.settings.numberConnectLevel }}</li>
          <li v-if="store.state.settings.includeWritingTask">写名字</li>
          <li v-if="store.state.settings.includeSingingTask">跟唱记录</li>
        </ul>
      </ResultCard>
      <AppButton block @click="start">开始训练</AppButton>
      <RouterLink to="/setup"><AppButton tone="quiet" block>调整设置</AppButton></RouterLink>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import { useTrainingStore } from '../stores/trainingStore';

const router = useRouter();
const store = useTrainingStore();

function start() {
  store.startTodaySession();
  router.push('/math');
}
</script>

<style scoped>
h2 {
  margin: 0 0 12px;
}

li {
  margin: 10px 0;
  font-size: 1.1rem;
}
</style>
