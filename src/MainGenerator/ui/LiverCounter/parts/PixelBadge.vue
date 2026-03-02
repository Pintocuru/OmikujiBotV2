<!-- src/MainGenerator/ui/LiverCounter/parts/PixelBadge.vue -->
<template>
  <div class="flex flex-wrap justify-center gap-4 px-4 py-4">
    <div
      v-for="(key, i) in allKeys"
      :key="key"
      class="relative w-32 h-28 flex items-center justify-center overflow-hidden border-4 border-current shadow-xl transition duration-150 pixel-badge"
      :class="`bg-${getPattern(key)}-content text-${getPattern(key)}`"
      :style="{ animationDelay: `${i * 0.08}s` }"
    >
      <!-- corner -->
      <span class="absolute -top-px -left-px w-6 h-6 border-t-4 border-l-4 border-current" />
      <span class="absolute -top-px -right-px w-6 h-6 border-t-4 border-r-4 border-current" />
      <span class="absolute -bottom-px -left-px w-6 h-6 border-b-4 border-l-4 border-current" />
      <span class="absolute -bottom-px -right-px w-6 h-6 border-b-4 border-r-4 border-current" />

      <!-- content -->
      <div class="relative flex flex-col items-center justify-center pt-2">
        <!-- アイコン -->
        <component :is="getLabel(key)" v-if="isComponent(getLabel(key))" class="w-10 h-10 drop-shadow" />

        <!-- ラベル -->
        <span v-else class="text-2xl font-bold truncate">
          {{ getLabel(key) }}
        </span>

        <!-- 数値 -->
        <div class="text-3xl font-bold tracking-wide whitespace-nowrap drop-shadow">
          {{ formatValue(counters[key] ?? 0) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toRef } from 'vue'
  import type { SettingsLiverCounterType } from '@/types/'
  import { useLiverCounterDisplay } from '../composables/useLiverCounterDisplay'
  import { useLiverLabelResolver } from '../composables/useLiverLabelResolver'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const { getLabel, isComponent } = useLiverLabelResolver(props.eventLabels)
  const { allKeys, getPattern, formatValue } = useLiverCounterDisplay(toRef(props, 'settings'))
</script>

<style scoped>
  .pixel-badge {
    animation: badgeDrop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes badgeDrop {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
