<!-- src/MainGenerator/ui/DeadAir/DeadAir.vue -->
<template>
  <DeadAirManager :settings="deadSettings" :counters="counters" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@main/stores/useAppStore'
  import { SettingsDeadSchema } from '@/types/OmikujiData/UiSettings/SettingsDeadSchema'
  import { useStreamCounters } from '@main/ui/common/useStreamCounters'
  import DeadAirManager from './parts/DeadAirManager.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const deadSettings = computed(() => SettingsDeadSchema.parse(data.value.components.settings.deadAir ?? {}))

  // eventRules から counterKey を抽出して渡す
  const eventKeys = computed(() => deadSettings.value.eventRules.map((r) => r.counterKey).filter(Boolean))

  const { counters } = useStreamCounters(eventKeys)
</script>
