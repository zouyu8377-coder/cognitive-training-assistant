<template>
  <div class="pad">
    <button v-for="key in keys" :key="key" type="button" @click="$emit('press', key)">
      {{ key }}
    </button>
    <button type="button" @click="$emit('clear')">清空</button>
    <button type="button" @click="$emit('press', 0)">0</button>
    <button type="button" @click="$emit('backspace')">退格</button>
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
  min-height: clamp(48px, 8.5svh, 64px);
  border: 1px solid #cad8d1;
  border-radius: 8px;
  background: #ffffff;
  color: #213633;
  font-size: clamp(1.1rem, 4.6vw, 1.3rem);
  font-weight: 800;
}
</style>
