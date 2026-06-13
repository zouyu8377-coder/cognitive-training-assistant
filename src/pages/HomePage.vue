<template>
  <PageContainer>
    <section class="hero">
      <header class="brand-bar">
        <strong>居家认知训练助手</strong>
        <span aria-hidden="true">◎</span>
      </header>

      <div class="welcome">
        <h1>今天感觉怎么样？<br />我们轻松练一会儿</h1>
        <p class="lead">坚持练习，每天都有进步。</p>
      </div>

      <div class="main-actions">
        <AppButton class="start-button" block @click="startPractice">▶ 开始今天的练习</AppButton>
        <AppButton v-if="store.state.currentSession" tone="secondary" block @click="continueDraft">
          ↻ 继续上次练习
        </AppButton>
      </div>

      <div class="secondary-actions">
        <RouterLink to="/setup"><AppButton tone="quiet" block>⚙ 练习设置</AppButton></RouterLink>
        <RouterLink to="/history"><AppButton tone="quiet" block>▣ 历史记录</AppButton></RouterLink>
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
import { hasSavedSettings } from '../utils/storage';
import { nextTaskRoute } from '../utils/trainingFlow';

const router = useRouter();
const store = useTrainingStore();

function startPractice() {
  router.push(hasSavedSettings() ? '/today' : '/setup');
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
  grid-template-rows: auto 1fr auto auto auto;
  gap: 20px;
}

.brand-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-primary);
}

.welcome {
  align-self: center;
}

.welcome h1 {
  margin: 0;
  font-size: clamp(1.85rem, 7vw, 2.55rem);
  line-height: 1.3;
}

.lead {
  margin: 14px 0 0;
  font-size: 1.05rem;
  color: var(--color-muted);
}

.main-actions {
  display: grid;
  gap: 10px;
}

.start-button {
  min-height: 64px;
  font-size: 1.08rem;
}

.secondary-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.compact {
  margin: 0;
  padding: 10px 0 0;
  border: 0;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  background: transparent;
  font-size: 0.78rem;
  line-height: 1.55;
}

@media (max-width: 520px) {
  .hero {
    gap: 16px;
  }
}
</style>
