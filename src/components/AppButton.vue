<template>
  <button class="app-button" :class="[`tone-${tone}`, { block }]" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'primary' | 'secondary' | 'quiet';
    block?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit';
  }>(),
  {
    tone: 'primary',
    block: false,
    disabled: false,
    type: 'button',
  },
);
</script>

<style scoped>
.app-button {
  min-height: 56px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 12px 18px;
  font-size: 1rem;
  line-height: 1.35;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition: background 140ms ease, transform 140ms ease;
}

.app-button:active:not(:disabled) {
  transform: translateY(1px);
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
  background: var(--color-primary);
}

.tone-secondary {
  color: var(--color-text);
  border-color: #bfd2c9;
  background: var(--color-primary-soft);
}

.tone-quiet {
  color: var(--color-text);
  border-color: var(--color-border);
  background: var(--color-surface);
  box-shadow: none;
}

@media (max-width: 520px) {
  .app-button {
    min-height: 54px;
    padding: 11px 14px;
    font-size: 0.98rem;
  }
}
</style>
