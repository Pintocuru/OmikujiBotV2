<!-- src/MainGenerator/ui/LiverCounter/parts/BasicCircle.vue -->
<template>
  <div class="flex flex-wrap justify-center gap-4 py-4">
    <template v-if="settings.component === 'basicCircle'">
      <BasicCircleItem
        v-for="(key, index) in allKeys"
        :key="key"
        :index="index"
        :label="getLabel(key)"
        :value="formatValue(counters[key] ?? 0)"
        :color-pattern="getPattern(key)"
      />
    </template>

    <template v-else>
      <BasicCirclePlainItem
        v-for="(key, index) in allKeys"
        :key="key"
        :index="index"
        :label="getLabel(key)"
        :value="formatValue(counters[key] ?? 0)"
        :color-pattern="getPattern(key)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { toRef } from 'vue'
  import type { SettingsLiverCounterType } from '@/types/'
  import BasicCircleItem from './BasicCircleItem.vue'
  import BasicCirclePlainItem from './BasicCirclePlainItem.vue'
  import { useLiverCounterDisplay } from '../composables/useLiverCounterDisplay'
  import { useLiverLabelResolver } from '../composables/useLiverLabelResolver'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const { getLabel } = useLiverLabelResolver(props.eventLabels)
  const { allKeys, getPattern, formatValue } = useLiverCounterDisplay(toRef(props, 'settings'))
</script>
