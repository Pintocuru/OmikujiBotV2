<!-- src/MainGenerator/ui/FlightSeat/FlightSeat.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <SeatSelector
      :color="settings.color"
      :label="settings.label"
      :seats="seats"
      :kind="settings.component"
      :customLayout="parsedCustomLayout"
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
  import { calculateTotalSeats, parseCustomLayout } from './composables/seatLayoutUtils'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSchema.parse({}))

  const { isComment } = useVisibilityAccess()

  // defaults が唯一の座席数の定義元、customLayout があれば上書き
  const defaultValue = computed(() => flightComponentDefaults[settings.value.component])
  const totalSeats = computed(() => calculateTotalSeats(defaultValue.value, settings.value.customLayout))

  // string型のdefaultまたはcustomLayoutを行配列に変換してSeatSelectorへ渡す
  const parsedCustomLayout = computed(() => parseCustomLayout(defaultValue.value, settings.value.customLayout))

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
