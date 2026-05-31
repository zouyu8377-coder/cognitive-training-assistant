<template>
  <PageContainer>
    <ProgressHeader title="跟唱记录" label="熟悉的歌" />
    <section class="task stack">
      <p>可以选择一首熟悉的歌曲，听一听或跟着唱一小段。完成后点击对应状态。</p>
      <AppButton block @click="choose('completed_good')">已完成，状态不错</AppButton>
      <AppButton tone="secondary" block @click="choose('completed_tired')">已完成，但有些疲劳</AppButton>
      <AppButton tone="quiet" block @click="choose('skipped')">今天不想做</AppButton>
      <AppButton tone="quiet" block @click="choose('not_done')">未进行</AppButton>
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

function choose(status: TrainingSession['singingStatus']) {
  store.setSingingStatus(status);
  router.push('/complete');
}
</script>

<style scoped>
.task {
  padding-top: 20px;
}

p {
  font-size: 1.35rem;
  line-height: 1.6;
}
</style>
