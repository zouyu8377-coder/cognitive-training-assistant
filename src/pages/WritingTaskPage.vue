<template>
  <PageContainer>
    <ProgressHeader title="写名字" label="纸笔任务" />
    <section class="task stack">
      <p>请在纸上写一次自己的名字。写完后点击“已完成”。</p>
      <AppButton block @click="choose('completed')">已完成</AppButton>
      <AppButton tone="secondary" block @click="choose('skipped')">今天不想做</AppButton>
      <AppButton tone="quiet" block @click="choose('help_needed')">需要家属帮助</AppButton>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import { useTrainingStore } from '../stores/trainingStore';
import type { TrainingSession } from '../types';

const router = useRouter();
const store = useTrainingStore();

function choose(status: TrainingSession['writingStatus']) {
  store.setWritingStatus(status);
  router.push(store.state.settings.includeSingingTask ? '/singing' : '/complete');
}
</script>

<style scoped>
.task {
  padding-top: 20px;
}

p {
  font-size: 1.45rem;
  line-height: 1.6;
}
</style>
