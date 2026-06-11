<template>
  <PageContainer>
    <ProgressHeader title="训练设置" label="家属设置" />
    <form class="stack" @submit.prevent="save">
      <label>
        患者昵称
        <input v-model="form.patientNickname" placeholder="例如：妈妈" />
      </label>
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
      <label class="check consent">
        <input v-model="form.cloudTrackingConsent" type="checkbox" />
        <span>允许上传患者昵称、练习过程和完成情况，供项目管理员了解试用情况</span>
      </label>
      <p class="muted">默认设置偏低压力，优先帮助完成和保持参与意愿。</p>
      <AppButton type="submit" block>保存并查看今日训练</AppButton>
      <p class="privacy-note">
        启用云端记录后，患者昵称、练习过程和完成情况会安全上传，供本项目管理员了解试用情况。
      </p>
    </form>
  </PageContainer>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import { useTrainingStore } from '../stores/trainingStore';
import type { TrainingSettings } from '../types';

const router = useRouter();
const store = useTrainingStore();
const form = reactive<TrainingSettings>({ ...store.state.settings });

function save() {
  store.updateSettings({
    ...form,
    patientNickname: form.patientNickname.trim() || '家人',
    includeSubtraction: ['L2', 'L4', 'L5', 'L6'].includes(form.mathLevel),
  });
  router.push('/today');
}
</script>

<style scoped>
label {
  display: grid;
  gap: 8px;
  font-weight: 800;
}

input,
select {
  min-height: 48px;
  border: 1px solid #c9d6cf;
  border-radius: 8px;
  padding: 9px 12px;
  background: #ffffff;
}

.check {
  grid-template-columns: 28px 1fr;
  align-items: center;
}

.check input {
  min-height: 28px;
}

.privacy-note {
  margin: 0;
  color: #64706c;
  font-size: 0.9rem;
  line-height: 1.6;
}

.consent {
  padding: 12px;
  border: 1px solid #d3ded7;
  border-radius: 8px;
  background: #ffffff;
  font-weight: 700;
  line-height: 1.5;
}
</style>
