<template>
  <button class="app-button" :class="[`tone-${tone}`, { block }]" :type="type">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'primary' | 'secondary' | 'quiet';
    block?: boolean;
    type?: 'button' | 'submit';
  }>(),
  {
    tone: 'primary',
    block: false,
    type: 'button',
  },
);
</script>

<style scoped>
.app-button {
  min-height: 42px;
  border: 0;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.95rem;
  line-height: 1.35;
  font-weight: 700;
  cursor: pointer;
}

.app-button:disabled {
  cursor: default;
  opacity: 0.68;
}

.block {
  width: 100%;
}

.tone-primary {
  color: #ffffff;
  background: #2f6f61;
}

.tone-secondary {
  color: #213633;
  background: #dfe9df;
}

.tone-quiet {
  color: #36504a;
  background: transparent;
  border: 1px solid #c8d5cc;
}

@media (max-width: 520px) {
  .app-button {
    min-height: 40px;
    padding: 8px 12px;
    font-size: 0.94rem;
  }
}

@media (max-width: 520px) {
  .app-button {
    min-height: 36px;
    padding: 6px 8px;
    font-size: 0.88rem;
  }
}
</style>
