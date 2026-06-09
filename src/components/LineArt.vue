<template>
  <img v-if="isImage" class="object-image" :src="kind" :alt="label" />
  <svg v-else class="line-art" viewBox="0 0 160 130" role="img" :aria-label="label">
    <g v-if="kind === 'zebra'" fill="none" stroke="#26312f" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M29 73c6-25 35-39 70-31 15 4 25 11 31 22 8 16-1 34-22 42-29 12-69 6-82-15-4-6-4-12 3-18z" />
      <path d="M123 55c11-13 28-7 30 7 3 14-8 25-21 21M136 51l3-17M147 55l11-10" />
      <path d="M34 93v29M56 104v23M91 107v20M113 99v28" />
      <path d="M45 50l-11 43M62 43L48 99M82 41L66 106M101 46L84 110M118 59l-15 44" />
      <path d="M28 72c-12-9-14-23-4-31M28 70l-16-4" />
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
import { computed } from 'vue';

const props = defineProps<{ kind: string; label: string }>();
const isImage = computed(() => /\.(jpe?g|png|webp|gif|svg)$/i.test(props.kind));
</script>

<style scoped>
.line-art {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1.23;
  display: block;
  margin: 0 auto;
}

.object-image {
  width: 100%;
  max-width: 360px;
  max-height: 280px;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

@media (max-width: 520px) {
  .line-art {
    max-width: 170px;
  }

  .object-image {
    max-height: 108px;
  }
}
</style>
