<template>
  <svg class="line-art" viewBox="0 0 160 130" role="img" :aria-label="label">
    <g v-if="kind === 'zebra'" fill="none" stroke="#26312f" stroke-width="5" stroke-linecap="round">
      <ellipse cx="78" cy="72" rx="48" ry="28" />
      <circle cx="122" cy="58" r="17" />
      <path d="M34 82v30M58 94v24M96 94v24M116 82v30M120 40l8-18M132 43l13-11" />
      <path d="M52 48l-10 42M72 44l-12 52M92 46L78 96M112 52L98 90" />
    </g>
    <g v-else-if="kind === 'ruler'" fill="none" stroke="#26312f" stroke-width="5" stroke-linecap="round">
      <rect x="22" y="44" width="116" height="42" rx="5" />
      <path v-for="x in [40, 56, 72, 88, 104, 120]" :key="x" :d="`M${x} 44v18`" />
    </g>
    <g v-else-if="kind === 'table'" fill="none" stroke="#26312f" stroke-width="5" stroke-linecap="round">
      <rect x="28" y="42" width="104" height="28" rx="4" />
      <path d="M42 70v45M118 70v45M36 92h88" />
    </g>
    <g v-else-if="kind === 'apple'" fill="none" stroke="#26312f" stroke-width="5" stroke-linecap="round">
      <path d="M80 45c-20-22-58-4-50 36 6 37 34 43 50 28 16 15 44 9 50-28 8-40-30-58-50-36z" />
      <path d="M80 45c3-17 11-24 24-29M88 27c13-6 27-1 34 8" />
    </g>
    <g v-else-if="kind === 'umbrella'" fill="none" stroke="#26312f" stroke-width="5" stroke-linecap="round">
      <path d="M25 72c10-36 100-36 110 0M80 72v39c0 17 27 17 27 0" />
      <path d="M25 72c14-12 25-12 39 0 12-12 20-12 32 0 14-12 25-12 39 0" />
    </g>
    <g v-else-if="kind === 'cup'" fill="none" stroke="#26312f" stroke-width="5" stroke-linecap="round">
      <path d="M42 38h70l-8 72H50z" />
      <path d="M112 55h14c19 0 19 32-2 32h-14" />
    </g>
    <g v-else-if="kind === 'key'" fill="none" stroke="#26312f" stroke-width="5" stroke-linecap="round">
      <circle cx="52" cy="68" r="24" />
      <path d="M76 68h60M112 68v18M128 68v13" />
    </g>
    <g v-else-if="kind === 'shoe'" fill="none" stroke="#26312f" stroke-width="5" stroke-linecap="round">
      <path d="M27 84c23 4 34-11 42-34h29c4 21 24 24 39 34 9 6 2 20-12 20H36c-15 0-20-14-9-20z" />
      <path d="M64 62h34M58 74h52" />
    </g>
    <g v-else-if="kind === 'circle'" fill="none" stroke="#26312f" stroke-width="6">
      <circle cx="80" cy="65" r="43" />
    </g>
    <g v-else-if="kind === 'rectangle'" fill="none" stroke="#26312f" stroke-width="6">
      <rect x="35" y="34" width="90" height="62" />
    </g>
    <g v-else-if="kind === 'diamond'" fill="none" stroke="#26312f" stroke-width="6">
      <path d="M80 18l56 47-56 47-56-47z" />
    </g>
    <g v-else-if="kind === 'triangle'" fill="none" stroke="#26312f" stroke-width="6">
      <path d="M80 20l55 92H25z" />
    </g>
    <g v-else fill="none" stroke="#26312f" stroke-width="6" stroke-linejoin="round">
      <path d="M80 18l14 34h37l-30 22 12 36-33-22-33 22 12-36-30-22h37z" />
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ kind: string; label: string }>();
</script>

<style scoped>
.line-art {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1.23;
  display: block;
  margin: 0 auto;
}
</style>
