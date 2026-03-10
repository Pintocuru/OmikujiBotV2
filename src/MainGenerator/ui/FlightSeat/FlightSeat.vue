<!-- src/MainGenerator/ui/FlightSeat/FlightSeat.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <SeatSelector
      :color="settings.color"
      :label="settings.label"
      :seats="seats"
      :componentConfig="settings.component"
      :statKey="settings.statKey"
    />

    <FlightSeatDebug :occupiedSeats="occupiedSeats" :totalSeats="totalSeats" :debugLog="debugLog" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsFlightSchema, flightComponentDefaults } from '@/types'
  import SeatSelector from './parts/SeatSelector.vue'
  import FlightSeatDebug from './FlightSeatDebug.vue'
  import { useSeatManager } from './composables/useSeatManager'
  import { calculateTotalSeats } from './composables/seatLayoutUtils'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@/MainGenerator/scripts/FeatureAccess/useAccessCheckerMain'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSchema.parse({}))
  const component = computed(() => settings.value.component)

  const { isComment } = useVisibilityAccess()

  const resolvedConfig = computed(() => ({
    ...flightComponentDefaults[component.value.kind],
    ...component.value,
  }))

  const parsedCustomLayout = computed(() => {
    if (!resolvedConfig.value.customLayout) return []
    try {
      return JSON.parse(resolvedConfig.value.customLayout) as number[]
    } catch {
      return []
    }
  })

  const totalSeats = computed(() =>
    calculateTotalSeats(
      resolvedConfig.value.layout!,
      resolvedConfig.value.rows!,
      resolvedConfig.value.cols!,
      parsedCustomLayout.value,
      resolvedConfig.value.circleSeats
    )
  )

  const { seats, occupiedSeats, debugLog, registerUser } = useSeatManager(totalSeats, (userId) =>
    appStore.userSession.stats.get(userId)
  )

  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    if (isComment.value && settings.value.targetEventKey) {
      unsubscribe = appStore.userSession.visits.onVisit(settings.value.targetEventKey, registerUser)
    } else {
      unsubscribe = appStore.userSession.stats.onUpdate(registerUser)
    }
  })

  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })
</script>
