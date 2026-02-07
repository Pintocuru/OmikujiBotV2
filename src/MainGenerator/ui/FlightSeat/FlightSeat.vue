<!-- src\MainGenerator\ui\FlightSeat\FlightSeat.vue -->
<template>
  <div class="p-4 max-w-6xl mx-auto" :data-theme="settings.color">
    <!-- タイトル -->
    <h2 v-if="settings.title" class="text-2xl font-bold text-center mb-6">
      {{ settings.title }}
    </h2>

    <!-- 履歴がある場合は履歴を表示、ない場合は現在の座席を表示 -->
    <div class="mb-8">
      <SeatHistoryViewer
        v-if="seatHistory.length > 0"
        :seatHistory="seatHistory"
        :layout="settings.layout"
        :rows="settings.rows"
        :cols="settings.cols"
      />
      
      <SeatGrid
        v-else
        :seats="seats"
        :layout="settings.layout"
        :rows="settings.rows"
        :cols="settings.cols"
      />
    </div>

    <!-- 統計情報 -->
    <div class="stats shadow mt-4 w-full">
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

    <!-- デバッグログ（開発時のみ表示） -->
    <details v-if="debugLog.length > 0" class="mt-4">
      <summary class="cursor-pointer text-sm text-base-content/70">デバッグログ ({{ debugLog.length }}件)</summary>
      <div class="mt-2 p-4 bg-base-200 rounded-lg max-h-60 overflow-y-auto">
        <div v-for="(log, index) in debugLog.slice().reverse()" :key="index" class="text-xs font-mono mb-1">
          {{ log }}
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@main/stores/useAppStore'
  import SeatGrid from './SeatGrid.vue'
  import SeatHistoryViewer from './SeatHistoryViewer.vue'
  import { useSeatManager } from './useSeatManager'
  import { calculateTotalSeats } from './seatLayoutUtils'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.flightSeat)

  // Store から live コメントユーザーを取得
  const liveCommentUsers = computed(() => {
    return appStore.userVisitManager.getVisitsByRuleId('liveComments')
  })

  // 総座席数を計算
  const totalSeats = computed(() => {
    return calculateTotalSeats(settings.value.layout, settings.value.rows, settings.value.cols)
  })

  // 座席管理
  const { seats, seatHistory, occupiedSeats, debugLog, updateSeats, resetSeats } = useSeatManager({
    totalSeats,
    historyLimit: computed(() => settings.value.historyLimit),
  })

  // ユーザーリストの変更を監視
  watch(
    liveCommentUsers, 
    () => updateSeats(liveCommentUsers.value), 
    { immediate: true, deep: true }
  )

  // 設定変更時に座席をリセット
  watch(
    () => [settings.value.layout, settings.value.rows, settings.value.cols],
    () => {
      resetSeats()
      updateSeats(liveCommentUsers.value)
    },
    { deep: true }
  )
</script>