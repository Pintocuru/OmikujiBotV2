<template>
  <div class="min-w-sm mx-auto" :data-theme="settings.color">
    <!-- タイトル -->
    <h2 v-if="settings.title" class="text-2xl font-bold text-center mb-6">
      {{ settings.title }}
    </h2>

    <!-- 履歴表示モード切り替えボタン -->
    <div v-if="seatHistory.length > 0" class="mb-4 flex justify-center">
      <button @click="showHistoryMode = !showHistoryMode" class="btn btn-sm btn-outline">
        <span v-if="!showHistoryMode">📜 過去の座席を見る ({{ seatHistory.length }}回)</span>
        <span v-else>🔄 現在の座席に戻る</span>
      </button>
    </div>

    <!-- 座席グリッド表示 -->
    <div class="mb-8">
      <div v-if="showHistoryMode && seatHistory.length > 0">
        <SeatHistoryViewer
          :seatHistory="seatHistory"
          :layout="settings.layout"
          :rows="settings.rows"
          :cols="settings.cols"
        />
      </div>
      <div v-else>
        <SeatGrid
          :seats="seats"
          :layout="settings.layout"
          :rows="settings.rows"
          :cols="settings.cols"
        />
      </div>
    </div>

    <!-- 統計情報 -->
    <div class="stats shadow mt-4 w-full">
      <div class="stat">
        <div class="stat-title">現在の乗車人数</div>
        <div class="stat-value text-primary">{{ occupiedSeats }}</div>
        <div class="stat-desc">/ {{ totalSeats }}席 (待機: {{ pendingCount }}人)</div>
      </div>
      <div class="stat">
        <div class="stat-title">座席リセット回数</div>
        <div class="stat-value text-secondary">{{ seatHistory.length }}</div>
        <div class="stat-desc">履歴として保存中</div>
      </div>
    </div>

    <!-- デバッグログ -->
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@main/stores/useAppStore'
import SeatGrid from './SeatGrid.vue'
import SeatHistoryViewer from './SeatHistoryViewer.vue'
import { useSeatManager } from './useSeatManager'
import { calculateTotalSeats } from './seatLayoutUtils'

const appStore = useAppStore()
const { data } = storeToRefs(appStore)
const settings = computed(() => data.value.components.settings.flightSeat)

const showHistoryMode = ref(false)

const totalSeats = computed(() => {
  return calculateTotalSeats(settings.value.layout, settings.value.rows, settings.value.cols)
})

const { 
  seats, 
  seatHistory, 
  occupiedSeats, 
  pendingCount,
  debugLog, 
  handleVisitEvent 
} = useSeatManager({
  totalSeats,
  historyLimit: computed(() => settings.value.historyLimit),
  allowReseating: computed(() => settings.value.allowReseating),
})

// イベントリスナーの登録と解除
let unsubscribe: (() => void) | null = null

onMounted(() => {
  // userVisitManager にイベントリスナーを登録
  unsubscribe = appStore.userVisitManager.onVisit('liveComments', handleVisitEvent)
})

onUnmounted(() => {
  // コンポーネント破棄時にリスナーを解除
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>