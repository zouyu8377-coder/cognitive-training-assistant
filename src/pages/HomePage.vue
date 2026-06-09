<template>
  <PageContainer>
    <section class="hero">
      <h1>居家认知训练助手</h1>
      <p class="lead">今天一起做几个轻松的小练习。</p>
      <AppButton class="start-button" block @click="startPractice">开始练习</AppButton>

      <div class="secondary-actions">
        <AppButton v-if="store.state.currentSession" tone="secondary" block @click="continueDraft">
          继续练习
        </AppButton>
        <RouterLink to="/setup"><AppButton tone="quiet" block>设置练习</AppButton></RouterLink>
        <RouterLink to="/history"><AppButton tone="quiet" block>历史记录</AppButton></RouterLink>
      </div>

      <p class="notice compact">
        本工具仅用于家庭日常认知活动辅助和训练记录，不提供医学诊断、治疗建议或紧急救助服务。
      </p>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import { useTrainingStore } from '../stores/trainingStore';
import { nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();

function startPractice() {
  store.discardCurrentSession();
  store.startTodaySession('steady');
  router.push('/math');
}

function continueDraft() {
  if (!store.state.currentSession) return;
  router.push(nextTaskRoute(store.state.settings, store.state.currentSession));
}
</script>

<style scoped>
.hero {
  min-height: calc(100svh - 56px);
  display: grid;
  align-content: center;
  gap: 18px;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 8vw, 2.6rem);
  line-height: 1.18;
}

.lead {
  margin: 0;
  font-size: 1.15rem;
  color: #52615d;
}

.start-button {
  min-height: 58px;
  font-size: 1.2rem;
}

.secondary-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.secondary-actions > :first-child {
  grid-column: 1 / -1;
}

.compact {
  margin: 0;
  padding: 12px;
  font-size: 0.92rem;
}
</style>
