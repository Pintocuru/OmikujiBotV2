<!-- CookieCounter.vue -->
<template>
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
    <CookieCounterSelector
      :settings="cookieSettings"
      :counters="counters"
      :event-labels="eventLabels"
      :variable-labels="variableLabels"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CookieCounterSchema } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useStreamCounters } from '@main/ui/common/useStreamCounters'
  import CookieCounterSelector from './parts/CookieCounterSelector.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const cookieSettings = computed(() => data.value.components.settings.cookieCounter ?? CookieCounterSchema.parse({}))

  // type: 'event' のターゲットキー一覧
  const eventKeys = computed<string[]>(() =>
    cookieSettings.value.counters.filter((c) => c.type === 'event').map((c) => c.target)
  )

  // type: 'variable' の { target → label } マップ
  const variableLabelMap = computed<Record<string, string>>(() =>
    Object.fromEntries(
      cookieSettings.value.counters.filter((c) => c.type === 'variable').map((c) => [c.target, c.label])
    )
  )

  const { counters, eventLabels, variableLabels } = useStreamCounters(eventKeys, variableLabelMap)
</script>
