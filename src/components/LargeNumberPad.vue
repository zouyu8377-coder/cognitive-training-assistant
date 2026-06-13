<template>
  <div class="pad">
    <button v-for="key in keys" :key="key" type="button" @click="$emit('press', key)">
      {{ key }}
    </button>
    <button class="utility" type="button" @click="$emit('clear')">清空</button>
    <button type="button" @click="$emit('press', 0)">0</button>
    <button class="utility" type="button" @click="$emit('backspace')">退格</button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  press: [value: number];
  clear: [];
  backspace: [];
}>();

const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<style scoped>
.pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

button {
  min-height: clamp(56px, 8.5svh, 68px);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: #ffffff;
  color: var(--color-text);
  font-size: clamp(1.1rem, 4.6vw, 1.3rem);
  font-weight: 800;
}

button:active {
  background: var(--color-primary-soft);
}

.utility {
  color: var(--color-muted);
  background: #edf1ed;
  font-size: 0.88rem;
}
</style>
