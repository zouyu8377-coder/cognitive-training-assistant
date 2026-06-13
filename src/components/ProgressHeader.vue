<template>
  <header class="progress-header">
    <button class="back" type="button" aria-label="返回" @click="goBack">
      <span aria-hidden="true">←</span>
      <span class="back-text">返回</span>
    </button>
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
  min-height: 52px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.title {
  min-width: 0;
}

.header-action {
  justify-self: end;
}

.header-action :deep(button) {
  min-width: 58px;
  min-height: 44px;
  border: 0;
  background: transparent;
  color: var(--color-muted);
  font-weight: 700;
}

.back {
  min-width: 58px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-weight: 700;
}

p {
  margin: 0 0 4px;
  color: var(--color-muted);
  font-size: 0.82rem;
}

strong {
  font-size: 1.2rem;
}

@media (max-width: 520px) {
  .progress-header {
    gap: 6px;
    min-height: 48px;
    margin-bottom: 8px;
  }

  .back {
    min-width: 44px;
    min-height: 42px;
  }

  .header-action :deep(button) {
    min-width: 50px;
    min-height: 42px;
  }

  p {
    margin-bottom: 2px;
    font-size: 0.82rem;
  }

  strong {
    font-size: 1.05rem;
  }
}

@media (max-width: 380px) {
  .back-text {
    display: none;
  }
}
</style>
