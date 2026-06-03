<template>
  <header class="progress-header">
    <button class="back" type="button" @click="goBack">返回</button>
    <div>
      <p>{{ label }}</p>
      <strong>{{ title }}</strong>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps<{ title: string; label?: string }>();

const router = useRouter();

function goBack() {
  router.back();
}
</script>

<style scoped>
.progress-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.back {
  min-width: 72px;
  min-height: 46px;
  border: 1px solid #cbd8d1;
  border-radius: 8px;
  background: #ffffff;
  color: #38504b;
}

p {
  margin: 0 0 4px;
  color: #68736f;
}

strong {
  font-size: 1.35rem;
}
</style>
