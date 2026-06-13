<template>
  <section class="result-card">
    <slot />
  </section>
</template>

<style scoped>
.result-card {
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
}

@media (max-width: 520px) {
  .result-card {
    padding: 14px;
  }
}
</style>
