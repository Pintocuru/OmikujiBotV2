<template>
  <div class="card w-full shadow-xl mx-auto p-4 space-y-2" :data-theme="settings.color">
    <!-- タイトル -->
    <h2 v-if="settings.title" class="text-xl font-bold text-center">
      {{ settings.title }}
    </h2>

    <!-- 座席グリッド表示 -->
    <div v-if="showHistoryMode && seatHistory.length > 0">
      <SeatHistoryViewer
        :seatHistory="seatHistory"
        :layout="settings.layout"
        :rows="settings.rows"
        :cols="settings.cols"
      />
    </div>
    <div v-else>
      <SeatGrid :seats="seats" :layout="settings.layout" :rows="settings.rows" :cols="settings.cols" />
    </div>

    <!-- 履歴表示モード切り替えボタン -->
    <div v-if="seatHistory.length > 0" class="flex justify-center">
      <button @click="showHistoryMode = !showHistoryMode" class="btn btn-sm btn-outline">
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

      <!-- デバッグログ -->
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
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@main/stores/useAppStore'
  import SeatGrid from './SeatGrid.vue'
  import SeatHistoryViewer from './SeatHistoryViewer.vue'
  import { useSeatManager } from './useSeatManager'
  import { calculateTotalSeats } from './seatLayoutUtils'
  import { isDev } from '@/types'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.flightSeat)

  const showHistoryMode = ref(false)

  const totalSeats = computed(() => {
    return calculateTotalSeats(settings.value.layout, settings.value.rows, settings.value.cols)
  })

  const { seats, seatHistory, occupiedSeats, debugLog, registerUser } = useSeatManager({
    totalSeats,
    historyLimit: computed(() => settings.value.historyLimit),
    allowReseating: computed(() => settings.value.allowReseating),
  })

  // イベントリスナーの登録と解除
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    // userVisitManager にイベントリスナーを登録
    unsubscribe = appStore.userVisitManager.onVisit('liveComments', registerUser)
  })

  onUnmounted(() => {
    // コンポーネント破棄時にリスナーを解除
    if (unsubscribe) {
      unsubscribe()
    }
  })
</script>
