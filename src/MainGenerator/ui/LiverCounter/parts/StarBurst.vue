<!-- src/MainGenerator/ui/LiverCounter/parts/StarBurst.vue -->
<template>
  <div class="flex flex-wrap justify-center items-center gap-4 px-4 py-4">
    <div
      v-for="(key, i) in allKeys"
      :key="key"
      class="relative w-32 h-32 flex items-center justify-center star-item"
      :class="`text-${getPattern(key)}`"
      :style="getStarStyle(i)"
    >
      <!-- 背景の星形 -->
      <Star class="absolute inset-0 w-full h-full" fill="currentColor" />

      <!-- コンテンツ -->
      <div class="relative flex flex-col items-center justify-center pt-2" :class="`text-${getPattern(key)}-content`">
        <!-- アイコン -->
        <component :is="getLabel(key)" v-if="isComponent(getLabel(key))" class="w-10 h-10" />

        <!-- ラベル -->
        <span v-else class="text-xl font-bold leading-none truncate">
          {{ getLabel(key) }}
        </span>

        <!-- 数値 -->
        <div class="text-3xl font-bold">
          {{ formatValue(counters[key] ?? 0) }}
        </div>
      </div>

      <!-- パーティクル -->
      <span class="sparkle sparkle-1 absolute rounded-full bg-white pointer-events-none w-3 h-3 top-4 right-5" />
      <span class="sparkle sparkle-2 absolute rounded-full bg-white pointer-events-none w-2 h-2 bottom-6 left-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toRef, type Component } from 'vue'
  import type { LiverDefaultKey, SettingsLiverCounterType } from '@/types/'
  import { Star } from 'lucide-vue-next'
  import { useLiverCounterDisplay } from '../composables/useLiverCounterDisplay'
  import { DEFAULT_LABELS } from '../composables/DefaultLabels'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const getLabel = (key: string): string | Component => {
    if (key in DEFAULT_LABELS) return DEFAULT_LABELS[key as LiverDefaultKey]
    return props.eventLabels[key] ?? key
  }

  const isComponent = (label: string | Component): label is Component => typeof label !== 'string'

  const formatValue = (v: number) => new Intl.NumberFormat().format(v)

  const { allKeys, getPattern } = useLiverCounterDisplay(toRef(props, 'settings'))

  const getStarStyle = (index: number) => {
    return {
      animationDelay: `${index * 0.15}s`,
    }
  }
</script>

<style scoped>
  .star-item {
    animation:
      starPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both,
      starPulse 3.5s ease-in-out infinite 0.5s;

    filter: drop-shadow(0 3px 8px color-mix(in srgb, currentColor 60%, transparent));
  }

  /* キラキラパーティクル */
  .sparkle {
    animation: sparkleAnim 2.5s ease-in-out infinite;
    opacity: 0;
  }

  .sparkle-1 {
    animation-delay: 0.3s;
  }

  .sparkle-2 {
    animation-delay: 1.2s;
  }

  @keyframes starPop {
    from {
      transform: scale(0) rotate(-15deg);
      opacity: 0;
    }
    to {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  @keyframes starPulse {
    0%,
    100% {
      transform: scale(1) rotate(0deg);
    }
    50% {
      transform: scale(1.05) rotate(2deg);
    }
  }

  @keyframes sparkleAnim {
    0%,
    100% {
      transform: scale(0);
      opacity: 0;
    }
    40% {
      transform: scale(1);
      opacity: 0.9;
    }
    60% {
      transform: scale(1);
      opacity: 0.9;
    }
    80% {
      transform: scale(0);
      opacity: 0;
    }
  }
</style>
