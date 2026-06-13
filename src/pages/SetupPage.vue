<template>
  <PageContainer>
    <ProgressHeader title="训练设置" label="家属设置" />
    <form class="setup-form" @submit.prevent="save">
      <section class="form-section">
        <h2>练习对象</h2>
        <label>
        患者昵称
        <input v-model="form.patientNickname" placeholder="例如：妈妈" />
        </label>
      </section>

      <section class="form-section">
        <h2>数学练习</h2>
        <label>
        单次数学题数量
        <select v-model.number="form.mathQuestionCount">
          <option :value="5">5 题</option>
          <option :value="10">10 题</option>
          <option :value="15">15 题</option>
          <option :value="20">20 题</option>
        </select>
        </label>
        <label>
        数学难度
        <select v-model="form.mathLevel">
          <option value="L1">简单：10 以内加法</option>
          <option value="L2">简单：10 以内加减</option>
          <option value="L3">中等：20 以内加法</option>
          <option value="L4">中等：20 以内加减</option>
          <option value="L5">困难：100 以内简单加减</option>
          <option value="L6">困难：100 以内进退位加减</option>
        </select>
        </label>
      </section>

      <section class="form-section">
        <h2>其他练习</h2>
        <label>
        数字顺序练习
        <select v-model.number="form.numberConnectLevel">
          <option :value="5">1-5</option>
          <option :value="10">1-10</option>
          <option :value="15">1-15</option>
        </select>
        </label>
        <label class="check">
        <input v-model="form.includeWritingTask" type="checkbox" />
        包含写名字任务
        </label>
        <label class="check">
        <input v-model="form.includeSingingTask" type="checkbox" />
        包含跟唱记录任务
        </label>
      </section>
      <section class="consent" aria-label="云端记录说明">
        <strong>云端记录已开启</strong>
        <span>患者昵称、练习过程和完成情况会上传，供项目管理员在其他设备查看使用情况。</span>
      </section>
      <p v-if="cloudMessage" class="cloud-message" :class="cloudStatus" role="status">{{ cloudMessage }}</p>
      <p class="muted helper">默认设置偏低压力，优先帮助完成和保持参与意愿。</p>
      <AppButton type="submit" block :disabled="saving">
        {{ saving ? '正在检查云端连接...' : '保存并查看今日训练' }}
      </AppButton>
      <p class="privacy-note">
        云端记录固定开启。患者昵称、练习过程和完成情况会安全上传，供本项目管理员了解试用情况。
      </p>
    </form>
  </PageContainer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import { useTrainingStore } from '../stores/trainingStore';
import type { TrainingSettings } from '../types';
import { prepareCloudTracking } from '../services/cloudTracking';

const router = useRouter();
const store = useTrainingStore();
const form = reactive<TrainingSettings>({ ...store.state.settings });
const saving = ref(false);
const cloudStatus = ref<'ready' | 'pending' | 'disabled'>('disabled');
const cloudMessage = ref('');

async function save() {
  if (saving.value) return;
  saving.value = true;
  const settings = {
    ...form,
    cloudTrackingConsent: true,
    patientNickname: form.patientNickname.trim() || '家人',
    includeSubtraction: ['L2', 'L4', 'L5', 'L6'].includes(form.mathLevel),
  };
  store.updateSettings(settings);
  const result = await prepareCloudTracking(settings.patientNickname);
  cloudStatus.value = result.status;
  cloudMessage.value = result.message;
  saving.value = false;
  if (result.status === 'pending' && settings.cloudTrackingConsent) return;
  router.push('/today');
}
</script>

<style scoped>
.setup-form {
  display: grid;
  gap: 14px;
}

.form-section {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
}

.form-section h2 {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.05rem;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 800;
}

input,
select {
  min-height: 54px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 9px 12px;
  background: #ffffff;
}

.check {
  grid-template-columns: 32px 1fr;
  align-items: center;
  min-height: 48px;
}

.check input {
  width: 28px;
  min-height: 28px;
  accent-color: var(--color-primary);
}

.privacy-note {
  margin: 0;
  color: #64706c;
  font-size: 0.9rem;
  line-height: 1.6;
}

.consent {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid #a9cbbc;
  border-radius: 8px;
  background: #edf6f1;
  line-height: 1.5;
}

.consent strong {
  color: #245f48;
}

.consent span {
  color: #52615d;
  font-size: 0.92rem;
}

.cloud-message {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.92rem;
  line-height: 1.5;
}

.cloud-message.ready {
  color: #245f48;
  background: #e7f3ea;
}

.helper {
  margin: 0;
  text-align: center;
  font-size: 0.88rem;
}

.cloud-message.pending,
.cloud-message.disabled {
  color: #735a1d;
  background: #fff4d8;
}
</style>
