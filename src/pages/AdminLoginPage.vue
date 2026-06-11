<template>
  <PageContainer>
    <ProgressHeader title="管理端登录" label="试用活动记录" />
    <form class="admin-form stack" @submit.prevent="login">
      <p class="muted">仅限已授权的管理员查看试用用户活动。</p>
      <label>
        邮箱
        <input v-model.trim="email" type="email" autocomplete="username" required />
      </label>
      <label>
        密码
        <input v-model="password" type="password" autocomplete="current-password" required />
      </label>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <AppButton type="submit" block :disabled="loading">
        {{ loading ? '正在登录...' : '登录' }}
      </AppButton>
    </form>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import ProgressHeader from '../components/ProgressHeader.vue';
import { isCloudConfigured } from '../lib/supabase';
import { isCurrentUserAdmin, signInAdmin } from '../services/cloudTracking';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref(isCloudConfigured ? '' : '云端服务尚未配置，请先设置 Supabase 环境变量。');

async function login() {
  if (!isCloudConfigured || loading.value) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    await signInAdmin(email.value, password.value);
    if (!(await isCurrentUserAdmin())) {
      throw new Error('该账号没有管理员权限');
    }
    await router.replace('/admin');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.admin-form {
  max-width: 480px;
  margin: 40px auto 0;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 800;
}

input {
  min-height: 48px;
  border: 1px solid #c9d6cf;
  border-radius: 8px;
  padding: 9px 12px;
  background: #ffffff;
}

.error {
  margin: 0;
  color: #9b2c2c;
}
</style>

