<template>
  <div class="flex flex-wrap justify-center gap-4 py-4">
    <BasicCircleItem
      v-for="key in displayKeys"
      :key="key"
      :label="labels[key]"
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
  }>()

  const labels: Record<LiverDefaultKey, string> = {
    upVote: '👍',
    viewer: '👀',
    syoken: '🆕',
    commenter: '💬',
    lc: '📈',
    totalPrice: '💰',
  }

  const displayKeys = computed(() => {
    return props.settings.defaultCounters
  })

  const getPattern = (key: LiverDefaultKey) => {
    const index = displayKeys.value.indexOf(key)
    if (index % 2 === 0) return props.settings.colorPattern
    return props.settings.colorPattern2 ?? props.settings.colorPattern
  }
</script>
