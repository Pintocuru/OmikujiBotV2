<!-- src/MainGenerator/ui/DeadAir/parts/DeadAirSelector.vue -->
<template>
  <component
    :is="currentLayout"
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
  import { computed } from 'vue'
  import type { SettingsDeadType } from '@/types/OmikujiData/UiSettings/SettingsDeadSchema'
  import type { DeadAirPhase } from '../DeadAir.vue'
  import DeadAirBomb from '../layouts/DeadAirBomb.vue'

  const props = defineProps<{
    settings: SettingsDeadType
    phase: DeadAirPhase
    formattedTime: string
    isWarning: boolean
    isCritical: boolean
    currentLives: number
    bonusFraction: number
    lifeFraction: number
    optionalValue: number | null
  }>()

  const layoutMap = { bomb: DeadAirBomb } as const

  const currentLayout = computed(() => layoutMap[props.settings.component] ?? DeadAirBomb)
</script>
