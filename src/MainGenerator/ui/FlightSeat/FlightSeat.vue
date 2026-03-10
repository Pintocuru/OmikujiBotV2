<!-- src/MainGenerator/ui/FlightSeat/FlightSeat.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <div class="card w-full bg-base-200 mx-auto p-4 space-y-2" :data-theme="settings.color">
      <h2 v-if="settings.label" class="text-xl font-bold text-center">
        {{ settings.label }}
      </h2>

      <SeatSelector :seats="seats" :componentConfig="settings.component" :statKey="settings.statKey" />

      <FlightSeatDebug :occupiedSeats="occupiedSeats" :totalSeats="totalSeats" :debugLog="debugLog" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsFlightSchema } from '@/types'
  import SeatSelector from './parts/SeatSelector.vue'
  import FlightSeatDebug from './FlightSeatDebug.vue'
  import { useSeatManager } from './composables/useSeatManager'
  import { calculateTotalSeats } from './composables/seatLayoutUtils'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@/MainGenerator/scripts/FeatureAccess/useAccessCheckerMain'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSchema.parse({}))

  const { isComment } = useVisibilityAccess()

  const parsedCustomLayout = computed(() => {
    if (!settings.value.component.customLayout) return []
    try {
      return JSON.parse(settings.value.component.customLayout) as number[]
    } catch {
      return []
    }
  })

  const totalSeats = computed(() =>
    calculateTotalSeats(
      settings.value.component.layout,
      settings.value.component.rows,
      settings.value.component.cols,
      parsedCustomLayout.value,
      settings.value.component.circleSeats
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
