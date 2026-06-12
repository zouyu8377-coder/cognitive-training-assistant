<template>
  <header class="progress-header">
    <button class="back" type="button" @click="goBack">返回</button>
    <div class="title">
      <p>{{ label }}</p>
      <strong>{{ title }}</strong>
    </div>
    <div v-if="$slots.action" class="header-action">
      <slot name="action" />
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
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.title {
  min-width: 0;
}

.header-action {
  justify-self: end;
}

.header-action :deep(button) {
  min-width: 72px;
  min-height: 46px;
  border: 1px solid #cbd8d1;
  border-radius: 8px;
  background: #ffffff;
  color: #38504b;
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

@media (max-width: 520px) {
  .progress-header {
    gap: 10px;
    margin-bottom: 8px;
  }

  .back {
    min-width: 58px;
    min-height: 36px;
  }

  .header-action :deep(button) {
    min-width: 58px;
    min-height: 36px;
  }

  p {
    margin-bottom: 2px;
    font-size: 0.82rem;
  }

  strong {
    font-size: 1.08rem;
  }
}
</style>
