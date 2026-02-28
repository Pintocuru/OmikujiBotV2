<!-- src/MainGenerator/ui/LiverCounter/parts/BasicCircle.vue -->
<template>
  <div class="flex flex-wrap justify-center gap-4 py-4">
    <BasicCircleItem
      v-for="key in allKeys"
      :key="key"
      :label="getLabel(key)"
      :value="counters[key] ?? 0"
      :color-pattern="getPattern(key)"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { LiverDefaultKey, SettingsLiverCounterType } from '@/types/'
  import BasicCircleItem from './BasicCircleItem.vue'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const DEFAULT_LABELS: Record<LiverDefaultKey, string> = {
    upVote: '👍',
    viewer: '👀',
    syoken: '🆕',
    commenter: '💬',
    lc: '📈',
    totalPrice: '💰',
  }

  const RAINBOW_PATTERN = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'] as const

  const allKeys = computed(() => {
    const defaults = props.settings.defaultCounters as string[]
    const events = props.settings.eventCounters ?? []
    const maxEvents = Math.max(0, 8 - defaults.length)
    return [...defaults, ...events.slice(0, maxEvents)]
  })

  const getLabel = (key: string): string => {
    // defaultCounters のキーならラベルマップから
    if (key in DEFAULT_LABELS) return DEFAULT_LABELS[key as LiverDefaultKey]
    // eventCounters のキーなら comments から取得した name を使用、なければキーそのまま
    return props.eventLabels[key] ?? key
  }

  const getPattern = (key: string): string => {
    const index = allKeys.value.indexOf(key)
    if (props.settings.colorPattern === null) {
      return RAINBOW_PATTERN[index % RAINBOW_PATTERN.length]
    }
    if (index % 2 === 0) return props.settings.colorPattern
    return props.settings.colorPattern2 ?? props.settings.colorPattern
  }
</script>
