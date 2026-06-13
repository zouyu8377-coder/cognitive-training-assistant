<template>
  <PageContainer>
    <ProgressHeader title="今日训练" label="准备开始" />
    <section class="stack">
      <ResultCard class="cloud-card" :class="cloudStatus">
        <h2>云端记录</h2>
        <p>{{ cloudMessage }}</p>
        <RouterLink v-if="cloudStatus !== 'ready'" to="/setup">
          <AppButton tone="quiet" block>{{ cloudStatus === 'disabled' ? '开启云端记录' : '重新检查连接' }}</AppButton>
        </RouterLink>
      </ResultCard>

      <ResultCard>
        <h2>{{ store.state.settings.patientNickname || '家人' }}，今天有这些练习</h2>
        <ul>
          <li>数学练习：{{ store.state.settings.mathQuestionCount }} 题</li>
          <li>数字顺序练习：1-{{ store.state.settings.numberConnectLevel }}</li>
          <li>看图写名称：4 题</li>
          <li>照着画图形：1 题</li>
          <li>找不同：3 题</li>
          <li v-if="store.state.settings.includeWritingTask">写名字</li>
          <li v-if="store.state.settings.includeSingingTask">跟唱记录</li>
        </ul>
      </ResultCard>

      <ResultCard v-if="todaySessions.length > 0">
        <h2>今天已有保存记录</h2>
        <p>今天已经保存过 {{ todaySessions.length }} 次训练记录。可以先查看历史，也可以继续开始一组新的训练。</p>
        <RouterLink to="/history"><AppButton tone="secondary" block>查看今日记录</AppButton></RouterLink>
      </ResultCard>

      <ResultCard>
        <h2>开始前确认</h2>
        <p class="muted">请家属简单看一下今天状态。这里只用于调整练习节奏，不做医学判断。</p>
        <div class="status-options">
          <label v-for="item in statusOptions" :key="item.value" class="status-option">
            <input v-model="preStatus" type="radio" :value="item.value" />
            <span>{{ item.label }}</span>
          </label>
        </div>
        <p v-if="preStatus !== 'steady'" class="notice small">
          今天可以从短练习开始，必要时减少题量或只做容易完成的任务。
        </p>
      </ResultCard>

      <AppButton v-if="store.state.currentSession" tone="secondary" block @click="continueDraft">
        继续未完成训练
      </AppButton>
      <AppButton block @click="start">开始新的训练</AppButton>
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
import type { PreTrainingStatus } from '../types';
import { todayKey } from '../utils/date';
import { preTrainingStatusText } from '../utils/sessionInsights';
import { loadSessions } from '../utils/storage';
import { nextTaskRoute } from '../utils/trainingFlow';
import { prepareCloudTracking, type CloudConnectionStatus } from '../services/cloudTracking';

const router = useRouter();
const store = useTrainingStore();
const preStatus = ref<PreTrainingStatus>('steady');
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
const statusOptions = (Object.keys(preTrainingStatusText) as PreTrainingStatus[]).map((value) => ({
  value,
  label: preTrainingStatusText[value],
}));

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
  store.startTodaySession(preStatus.value);
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

li {
  margin: 10px 0;
  font-size: 1.1rem;
}

.status-options {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.status-option {
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: center;
  min-height: 48px;
  padding: 8px 10px;
  border: 1px solid #d3ded7;
  border-radius: 8px;
  background: #ffffff;
  font-weight: 800;
}

.status-option input {
  width: 22px;
  height: 22px;
}

.small {
  margin-top: 12px;
  font-size: 0.96rem;
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
