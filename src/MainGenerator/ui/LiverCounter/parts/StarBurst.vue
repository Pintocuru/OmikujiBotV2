<template>
  <div class="flex flex-wrap justify-center gap-4 py-4">
    <StarBurstItem
      v-for="(key, i) in allKeys"
      :key="key"
      :index="i"
      :label="getLabel(key)"
      :value="formatValue(counters[key] ?? 0)"
      :color-pattern="getPattern(key)"
    />
  </div>
</template>

<script setup lang="ts">
  import { toRef } from 'vue'
  import type { SettingsLiverCounterType } from '@/types/'
  import { useLiverCounterDisplay } from '../composables/useLiverCounterDisplay'
  import { useLiverLabelResolver } from '../composables/useLiverLabelResolver'
  import StarBurstItem from './StarBurstItem.vue'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const { getLabel } = useLiverLabelResolver(props.eventLabels)
  const { allKeys, getPattern, formatValue } = useLiverCounterDisplay(toRef(props, 'settings'))
</script>
