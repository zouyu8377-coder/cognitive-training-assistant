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
  min-height: 56px;
  border: 0;
  border-radius: 8px;
  padding: 14px 20px;
  font-size: 1.08rem;
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
</style>
