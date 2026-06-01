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
</style>
