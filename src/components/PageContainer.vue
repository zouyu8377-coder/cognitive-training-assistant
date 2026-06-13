<template>
  <main class="page-shell">
    <slot />
  </main>
</template>

<style scoped>
.page-shell {
  width: min(100%, 720px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px 20px 36px;
}

@media (max-width: 520px) {
  .page-shell {
    padding: 10px 12px max(14px, env(safe-area-inset-bottom));
  }
}
</style>
