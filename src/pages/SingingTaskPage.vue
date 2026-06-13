<template>
  <PageContainer>
    <ProgressHeader title="跟唱记录" label="熟悉的歌" />
    <section class="task stack">
      <div class="music-mark" aria-hidden="true">♪</div>
      <h1>唱一首熟悉的歌</h1>
      <p>听一听，或者跟着唱一小段都可以。完成后选择最接近的感受。</p>
      <div class="choices">
        <AppButton block @click="choose('completed_good')">唱完了，感觉不错</AppButton>
        <AppButton tone="secondary" block @click="choose('completed_tired')">唱完了，有些累</AppButton>
        <AppButton tone="quiet" block @click="choose('skipped')">今天先不唱</AppButton>
      </div>
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
import { nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();

function choose(status: TrainingSession['singingStatus']) {
  const session = store.ensureSession();
  store.setSingingStatus(status);
  router.push(nextTaskRoute(store.state.settings, session));
}
</script>

<style scoped>
.task {
  min-height: calc(100svh - 100px);
  align-content: center;
  text-align: center;
}

.music-mark {
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  margin: 0 auto;
  border-radius: 50%;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  font-size: 2.8rem;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 1.65rem;
}

p {
  margin: 0;
  color: var(--color-muted);
  font-size: 1.12rem;
  line-height: 1.6;
}

.choices {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}
</style>
