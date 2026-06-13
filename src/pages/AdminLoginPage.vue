<template>
  <PageContainer>
    <form class="admin-form" @submit.prevent="login">
      <div class="admin-brand">居家认知训练助手</div>
      <div>
        <p class="eyebrow">管理端</p>
        <h1>登录查看试用记录</h1>
        <p class="muted">仅限已授权的管理员查看用户活动与详细答题记录。</p>
      </div>
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
  max-width: 440px;
  min-height: calc(100svh - 56px);
  display: grid;
  align-content: center;
  gap: 18px;
  margin: 0 auto;
}

.admin-brand {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-primary);
  font-weight: 800;
}

h1 {
  margin: 3px 0 10px;
  font-size: 1.75rem;
}

.eyebrow {
  margin: 0;
  color: var(--color-primary);
  font-size: 0.86rem;
  font-weight: 800;
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
