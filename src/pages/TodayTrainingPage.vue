<template>
  <PageContainer>
    <ProgressHeader title="今日训练" label="轻松完成每一项" />
    <section class="stack">
      <ResultCard class="cloud-card" :class="cloudStatus">
        <h2>云端记录</h2>
        <p>{{ cloudMessage }}</p>
        <RouterLink v-if="cloudStatus !== 'ready'" to="/setup">
          <AppButton tone="quiet" block>{{ cloudStatus === 'disabled' ? '开启云端记录' : '重新检查连接' }}</AppButton>
        </RouterLink>
      </ResultCard>

      <ResultCard class="training-list">
        <h1>{{ store.state.settings.patientNickname || '家人' }}，准备好了吗？</h1>
        <p>今天安排了几项轻松练习，按照顺序慢慢来。</p>
        <div class="task-row"><span>1</span><strong>数学练习</strong><small>{{ store.state.settings.mathQuestionCount }} 题</small></div>
        <div class="task-row"><span>2</span><strong>数字顺序</strong><small>1-{{ store.state.settings.numberConnectLevel }}</small></div>
        <div class="task-row"><span>3</span><strong>看图与绘画</strong><small>轻松完成</small></div>
        <div class="task-row"><span>4</span><strong>找不同</strong><small>3 题</small></div>
        <div v-if="store.state.settings.includeWritingTask" class="task-row"><span>5</span><strong>写名字</strong><small>手写练习</small></div>
        <div v-if="store.state.settings.includeSingingTask" class="task-row"><span>♪</span><strong>跟唱记录</strong><small>熟悉的歌</small></div>
      </ResultCard>

      <ResultCard v-if="todaySessions.length > 0">
        <h2>今天已有保存记录</h2>
        <p>今天已经保存过 {{ todaySessions.length }} 次训练记录。可以先查看历史，也可以继续开始一组新的训练。</p>
        <RouterLink to="/history"><AppButton tone="secondary" block>查看今日记录</AppButton></RouterLink>
      </ResultCard>

      <AppButton v-if="store.state.currentSession" tone="secondary" block @click="continueDraft">
        继续未完成训练
      </AppButton>
      <AppButton class="start-training" block @click="start">▶ 开始今天的训练</AppButton>
      <div v-if="confirmStartNew" class="inline-confirm">
        <p>开始新的训练会放弃上次未完成进度。</p>
        <div>
          <AppButton tone="quiet" @click="confirmStartNew = false">取消</AppButton>
          <AppButton @click="startConfirmed">仍然开始</AppButton>
        </div>
      </div>
      <RouterLink to="/setup"><AppButton tone="quiet" block>调整设置</AppButton></RouterLink>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import ResultCard from '../components/ResultCard.vue';
import { useTrainingStore } from '../stores/trainingStore';
import { todayKey } from '../utils/date';
import { loadSessions } from '../utils/storage';
import { nextTaskRoute } from '../utils/trainingFlow';
import { prepareCloudTracking, type CloudConnectionStatus } from '../services/cloudTracking';

const router = useRouter();
const store = useTrainingStore();
const confirmStartNew = ref(false);
const cloudStatus = ref<CloudConnectionStatus>(
  store.state.settings.cloudTrackingConsent ? 'pending' : 'disabled',
);
const cloudMessage = ref(
  store.state.settings.cloudTrackingConsent
    ? '正在检查云端连接...'
    : '云端记录未开启，管理员无法看到本次练习。',
);
const todaySessions = loadSessions().filter((session) => session.date === todayKey());
onMounted(refreshCloudStatus);

async function refreshCloudStatus() {
  const result = await prepareCloudTracking(store.state.settings.patientNickname);
  cloudStatus.value = result.status;
  cloudMessage.value = result.message;
}

function start() {
  if (store.state.currentSession) {
    confirmStartNew.value = true;
    return;
  }
  startConfirmed();
}

function startConfirmed() {
  confirmStartNew.value = false;
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
h2 {
  margin: 0 0 12px;
}

.training-list h1 {
  margin: 0;
  font-size: 1.4rem;
}

.training-list > p {
  color: var(--color-muted);
  line-height: 1.6;
}

.task-row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  border-top: 1px solid #e2e8e4;
}

.task-row > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  font-weight: 800;
}

.task-row small {
  color: var(--color-muted);
}

.start-training {
  min-height: 64px;
}

.inline-confirm {
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid #d8e1db;
  border-radius: 8px;
  background: #fffdf7;
}

.inline-confirm p {
  margin: 0;
  color: #52615d;
}

.inline-confirm div {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.cloud-card {
  border-color: #dbc98e;
}

.cloud-card.ready {
  border-color: #9fc9ad;
  background: #f1f8f3;
}

.cloud-card.pending,
.cloud-card.disabled {
  background: #fff9e9;
}

.cloud-card p {
  margin: 0 0 12px;
  line-height: 1.55;
}
</style>
