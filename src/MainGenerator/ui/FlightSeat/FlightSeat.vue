<!-- src/MainGenerator/ui/FlightSeat/FlightSeat.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <div class="card w-full bg-base-200 mx-auto p-4 space-y-2" :data-theme="settings.color">
      <h2 v-if="settings.label" class="text-xl font-bold text-center">
        {{ settings.label }}
      </h2>

      <SeatGrid
        :seats="seats"
        :layout="settings.layout"
        :rows="settings.rows"
        :cols="settings.cols"
        :customLayout="parsedCustomLayout"
        :circleSeats="settings.circleSeats"
        :statKey="settings.statKey"
      />

      <!-- 統計情報 & デバッグログ -->
      <template v-if="isDev && 0">
        <div class="stats shadow w-full">
          <div class="stat">
            <div class="stat-title">現在の乗車人数</div>
            <div class="stat-value text-primary">{{ occupiedSeats }}</div>
            <div class="stat-desc">/ {{ totalSeats }}席</div>
          </div>
        </div>

        <details class="mt-4">
          <summary class="cursor-pointer text-sm text-base-content/70">デバッグログ ({{ debugLog.length }}件)</summary>
          <div class="mt-2 p-4 bg-base-200 rounded-lg max-h-60 overflow-y-auto">
            <div v-for="(log, index) in debugLog.slice().reverse()" :key="index" class="text-xs font-mono mb-1">
              {{ log }}
            </div>
          </div>
        </details>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev, SettingsFlightSchema } from '@/types'
  import SeatGrid from './parts/SeatGrid.vue'
  import { useSeatManager } from './composables/useSeatManager'
  import { calculateTotalSeats } from './composables/seatLayoutUtils'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@/MainGenerator/scripts/FeatureAccess/useAccessCheckerMain'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSchema.parse({}))

  const { isComment } = useVisibilityAccess()

  const totalSeats = computed(() =>
    calculateTotalSeats(
      settings.value.layout,
      settings.value.rows,
      settings.value.cols,
      parsedCustomLayout.value,
      settings.value.circleSeats
    )
  )

  const { seats, occupiedSeats, debugLog, registerUser } = useSeatManager(totalSeats)

  const parsedCustomLayout = computed(() => {
    if (!settings.value.customLayout) return []
    try {
      return JSON.parse(settings.value.customLayout) as number[]
    } catch {
      return []
    }
  })

  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    // targetEventKey が空なら全体統計、あれば特定イベントのvisitを購読
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
