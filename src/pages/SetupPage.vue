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
          <option value="L1">L1：10 以内加法</option>
          <option value="L2">L2：10 以内加减</option>
          <option value="L3">L3：20 以内加法</option>
          <option value="L4">L4：20 以内加减</option>
          <option value="L5">L5：100 以内简单加减</option>
          <option value="L6">L6：100 以内进退位加减</option>
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
      <p class="muted">默认设置偏低压力，优先帮助完成和保持参与意愿。</p>
      <AppButton type="submit" block>保存并查看今日训练</AppButton>
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
  min-height: 54px;
  border: 1px solid #c9d6cf;
  border-radius: 8px;
  padding: 10px 12px;
  background: #ffffff;
}

.check {
  grid-template-columns: 28px 1fr;
  align-items: center;
}

.check input {
  min-height: 28px;
}
</style>
