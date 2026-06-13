<template>
  <PageContainer>
    <section class="complete stack">
      <div class="flower" aria-hidden="true">★</div>
      <p class="eyebrow">今天的练习已完成</p>
      <h1>做得真好，辛苦了！</h1>
      <p class="encouragement">每一次认真练习都很了不起。现在可以放松休息一下。</p>
      <p class="sync-status" :class="syncState">{{ syncMessage }}</p>
      <RouterLink to="/history"><AppButton block>查看今天的记录</AppButton></RouterLink>
      <RouterLink to="/"><AppButton tone="secondary" block>返回首页</AppButton></RouterLink>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import { useTrainingStore } from '../stores/trainingStore';

const store = useTrainingStore();
const syncState = ref<'saving' | 'synced' | 'queued' | 'disabled'>('saving');
const syncMessage = computed(() => {
  const messages = {
    saving: '正在保存本次练习记录...',
    synced: '本次练习记录已保存到云端。',
    queued: '网络暂时不稳定，记录已保存在手机中，联网后会自动补传。',
    disabled: '本次练习记录已保存在这台设备中。',
  };
  return messages[syncState.value];
});

onMounted(async () => {
  syncState.value = await store.finishAndSaveSession();
});
</script>

<style scoped>
.complete {
  min-height: 82vh;
  align-content: center;
  text-align: center;
}

.flower {
  width: 104px;
  height: 104px;
  display: grid;
  place-items: center;
  margin: 0 auto;
  border-radius: 50%;
  border: 10px solid #fff1b9;
  background: var(--color-accent);
  color: #684f0e;
  font-size: 2.4rem;
  font-weight: 900;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.eyebrow {
  margin: 0;
  color: var(--color-primary);
  font-weight: 800;
}

.encouragement {
  margin: 0 auto;
  max-width: 480px;
  color: var(--color-muted);
  line-height: 1.7;
}

.sync-status {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  color: #52615d;
  background: #ffffff;
}

.sync-status.synced {
  color: #245f48;
  background: #e7f3ea;
}

.sync-status.queued {
  color: #735a1d;
  background: #fff4d8;
}
</style>
