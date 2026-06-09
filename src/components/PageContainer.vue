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
  padding: 24px 18px 32px;
}

@media (max-width: 520px) {
  .page-shell {
    padding: 10px 12px 12px;
  }
}
</style>
