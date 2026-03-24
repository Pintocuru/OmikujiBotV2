<!-- src/ConfigMaker/UiEditor/DeadAir/DeadAirPreview.vue -->
<template>
  <HudPreview maxHeightClass="h-[440px]">
    <DeadAirSelector
      :settings="deadAir"
      :phase="phase"
      :formatted-time="formattedTime"
      :is-warning="isWarning"
      :is-critical="isCritical"
      :current-lives="currentLives"
      :bonus-fraction="bonusFraction"
      :life-fraction="lifeFraction"
      :optional-value="optionalValue"
    />

    <template #hud>
      <button class="btn btn-xs btn-ghost" @click="incrementAll">🎲 +1</button>
      <button class="btn btn-xs btn-ghost" @click="resetCounters">↩ reset</button>
      <button class="btn btn-xs btn-ghost" @click="tick">⏱ -10s</button>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed, toRef } from 'vue'
  import type { SettingsDeadType } from '@/types/OmikujiData/UiSettings/SettingsDeadSchema'
  import { useDeadAirLogic } from '@main/ui/DeadAir/composables/useDeadAirLogic'
  import DeadAirSelector from '@main/ui/DeadAir/parts/DeadAirSelector.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'

  const props = defineProps<{
    deadAir: SettingsDeadType
  }>()

  // ---------------------------------------------------------------------------
  // カウンター
  // ---------------------------------------------------------------------------

  const baseCounters: Record<string, number> = {
    upVote: 456,
    viewer: 123,
    syoken: 12,
    commenter: 45,
    lc: 789,
    totalPrice: 5000,
    follower: 78900,
  }

  const counters = ref<Record<string, number>>({ ...baseCounters })

  const allCounters = computed<Record<string, number>>(() => {
    const result: Record<string, number> = { ...baseCounters }
    for (const key of Object.keys(baseCounters)) {
      result[key] = counters.value[key] ?? baseCounters[key]
    }
    for (const rule of props.deadAir.eventRules) {
      const key = rule.counterKey
      if (!key || key in baseCounters) continue
      result[key] = counters.value[key] ?? 0
    }
    return result
  })

  // ---------------------------------------------------------------------------
  // ロジック
  // ---------------------------------------------------------------------------

  const settingsRef = toRef(props, 'deadAir')

  const {
    phase,
    formattedTime,
    isWarning,
    isCritical,
    currentLives,
    bonusFraction,
    lifeFraction,
    optionalValue,
    tick,
  } = useDeadAirLogic(settingsRef, allCounters)

  // ---------------------------------------------------------------------------
  // HUD 操作
  // ---------------------------------------------------------------------------

  const incrementAll = () => {
    const customKeys = props.deadAir.eventRules.map((r) => r.counterKey).filter(Boolean)
    const keys = [...Object.keys(baseCounters), ...customKeys]
    const updated: Record<string, number> = { ...counters.value }
    for (const key of keys) updated[key] = (updated[key] ?? 0) + 1
    counters.value = updated
  }

  const resetCounters = () => {
    counters.value = { ...baseCounters }
  }
</script>
