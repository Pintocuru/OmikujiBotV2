<!-- src/MainGenerator/ui/FlightSeat/FlightSeat.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <div class="card w-full bg-base-200 mx-auto p-4 space-y-2" :data-theme="settings.color">
      <h2 v-if="settings.label" class="text-xl font-bold text-center">
        {{ settings.label }}
      </h2>

      <div v-if="showHistoryMode && seatHistory.length > 0">
        <SeatHistoryViewer
          :seatHistory="seatHistory"
          :layout="settings.layout"
          :rows="settings.rows"
          :cols="settings.cols"
          :customLayout="parsedCustomLayout"
          :circleSeats="settings.circleSeats"
          :statKey="settings.statKey"
        />
      </div>
      <div v-else>
        <SeatGrid
          :seats="seats"
          :layout="settings.layout"
          :rows="settings.rows"
          :cols="settings.cols"
          :customLayout="parsedCustomLayout"
          :circleSeats="settings.circleSeats"
          :statKey="settings.statKey"
        />
      </div>

      <!-- 履歴操作ボタン群 -->
      <div class="flex justify-center gap-2">
        <!-- 履歴保存＆リセットボタン（常に表示） -->
        <button v-if="!showHistoryMode" @click="handleSaveAndReset" class="btn btn-sm btn-warning">
          📸 履歴を保存してリセット
        </button>

        <!-- 過去の履歴を見るボタン（履歴がある時のみ） -->
        <button
          v-if="seatHistory.length > 0"
          @click="showHistoryMode = !showHistoryMode"
          class="btn btn-sm btn-outline"
        >
          <span v-if="!showHistoryMode">📜 過去の座席を見る ({{ seatHistory.length }}回)</span>
          <span v-else>🔄 現在の座席に戻る</span>
        </button>
      </div>

      <!-- 統計情報 & デバッグログ -->
      <template v-if="isDev && 0">
        <div class="stats shadow w-full">
          <div class="stat">
            <div class="stat-title">現在の乗車人数</div>
            <div class="stat-value text-primary">{{ occupiedSeats }}</div>
            <div class="stat-desc">/ {{ totalSeats }}席</div>
          </div>
          <div class="stat">
            <div class="stat-title">座席リセット回数</div>
            <div class="stat-value text-secondary">{{ seatHistory.length }}</div>
            <div class="stat-desc">履歴として保存中</div>
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
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev, SettingsFlightSeatSchema } from '@/types'
  import SeatGrid from './parts/SeatGrid.vue'
  import SeatHistoryViewer from './SeatHistoryViewer.vue'
  import { useSeatManager } from './useSeatManager'
  import { calculateTotalSeats } from './seatLayoutUtils'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@/MainGenerator/scripts/FeatureAccess/useAccessCheckerMain'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSeatSchema.parse({}))

  const { isComment } = useVisibilityAccess()
  const showHistoryMode = ref(false)

  const totalSeats = computed(() =>
    calculateTotalSeats(
      settings.value.layout,
      settings.value.rows,
      settings.value.cols,
      parsedCustomLayout.value,
      settings.value.circleSeats
    )
  )

  const { seats, seatHistory, occupiedSeats, debugLog, registerUser, saveHistoryAndReset } = useSeatManager({
    totalSeats,
    isRandomReplacement: computed(() => settings.value.isRandomReplacement),
  })

  const parsedCustomLayout = computed(() => {
    if (!settings.value.customLayout) return []
    try {
      return JSON.parse(settings.value.customLayout) as number[]
    } catch {
      return []
    }
  })

  // 履歴保存＆リセット処理（現在の座席が空でも実行可能）
  function handleSaveAndReset() {
    saveHistoryAndReset()
    showHistoryMode.value = false
  }

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
