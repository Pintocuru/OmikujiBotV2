<!-- src/MainGenerator/ui/DeadAir/DeadAir.vue -->
<template>
  <DeadAirSelector
    :settings="settings"
    :phase="phase"
    :formatted-time="formattedTime"
    :is-warning="isWarning"
    :is-critical="isCritical"
    :current-lives="currentLives"
    :bonus-fraction="bonusFraction"
    :life-fraction="lifeFraction"
    :optional-value="optionalValue"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@main/stores/useAppStore'
  import { DeadAirSchema } from '@/types/OmikujiData/UiSettings/DeadAirSchema'
  import { useStreamCounters } from '@main/ui/common/useStreamCounters'
  import { useDeadAirLogic } from './composables/useDeadAirLogic'
  import DeadAirSelector from './parts/DeadAirSelector.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const settings = computed(() => DeadAirSchema.parse(data.value.components.settings.deadAir ?? {}))
  const eventKeys = computed(() => settings.value.eventRules.map((r) => r.counterKey).filter(Boolean))
  const { counters } = useStreamCounters(eventKeys, ref({}))

  const { phase, formattedTime, isWarning, isCritical, currentLives, bonusFraction, lifeFraction, optionalValue } =
    useDeadAirLogic(settings, ref(counters))
</script>
