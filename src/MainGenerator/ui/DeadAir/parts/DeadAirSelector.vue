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
  import type { DeadAirType } from '@/types/OmikujiData/UiSettings/DeadAirSchema'
  import { DeadAirPhase } from '../composables/useDeadAirLogic'
  import DeadAirBomb from '../layouts/DeadAirBomb.vue'

  const props = defineProps<{
    settings: DeadAirType
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
