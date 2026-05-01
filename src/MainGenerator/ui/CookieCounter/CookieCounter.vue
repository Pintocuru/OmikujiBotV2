<!-- src/MainGenerator/ui/CookieCounter/CookieCounter.vue -->
<template>
  <CenteringWrapper>
    <CookieCounterSelector
      :settings="cookieSettings"
      :counters="counters"
      :event-labels="eventLabels"
      :variable-labels="variableLabels"
    />
  </CenteringWrapper>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CookieCounterSchema } from '@/types'
  import CookieCounterSelector from './parts/CookieCounterSelector.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useStreamCounters } from '@main/ui/common/useStreamCounters'
  import CenteringWrapper from '@main/ui/common/CenteringWrapper.vue'

  const appStore = useAppStore()
  const cookieSettings = computed(() =>
    CookieCounterSchema.parse(appStore.data.components.settings.cookieCounter ?? {})
  )

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
