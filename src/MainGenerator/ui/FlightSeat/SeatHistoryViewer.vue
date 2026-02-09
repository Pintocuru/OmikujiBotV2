<!-- src\MainGenerator\ui\FlightSeat\SeatHistoryViewer.vue -->
<template>
  <div v-if="seatHistory.length > 0" class="space-y-4">
    <!-- ナビゲーション -->
    <div class="flex items-center justify-between">
      <button @click="previousHistory" :disabled="currentHistoryIndex === 0" class="btn btn-sm btn-circle">‹</button>

      <div class="text-center">
        <h3 class="text-sm font-semibold">過去の座席（{{ currentHistoryIndex + 1 }}回目）</h3>
        <p class="text-xs text-base-content/70">
          {{ formatDate(currentHistory.clearedAt) }}
        </p>
      </div>

      <button
        @click="nextHistory"
        :disabled="currentHistoryIndex === seatHistory.length - 1"
        class="btn btn-sm btn-circle"
      >
        ›
      </button>
    </div>

    <!-- 座席グリッド -->
    <SeatGrid
      :seats="currentHistory.seats"
      :layout="layout"
      :rows="rows"
      :cols="cols"
      :customLayout="customLayout"
      :circleSeats="circleSeats"
    />

    <!-- インジケーター -->
    <div class="flex justify-center gap-1">
      <div
        v-for="(_, index) in seatHistory"
        :key="index"
        class="w-2 h-2 rounded-full transition-all"
        :class="index === currentHistoryIndex ? 'bg-primary w-4' : 'bg-base-300'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { SeatLayout } from '@/types'
  import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import SeatGrid from './SeatGrid.vue'

  interface SeatHistory {
    seats: (UserVisitRecord | null)[]
    clearedAt: number
  }

  const props = defineProps<{
    seatHistory: SeatHistory[]
    layout: SeatLayout
    rows: number
    cols: number
    customLayout?: number[]
    circleSeats?: number
  }>()

  const currentHistoryIndex = ref(0)

  // 現在表示中の履歴
  const currentHistory = computed(() => {
    return props.seatHistory[currentHistoryIndex.value]
  })

  // 履歴が更新されたら最新を表示
  watch(
    () => props.seatHistory.length,
    (newLength) => {
      if (newLength > 0) {
        currentHistoryIndex.value = newLength - 1
      }
    }
  )

  // 前の履歴へ
  function previousHistory() {
    if (currentHistoryIndex.value > 0) {
      currentHistoryIndex.value--
    }
  }

  // 次の履歴へ
  function nextHistory() {
    if (currentHistoryIndex.value < props.seatHistory.length - 1) {
      currentHistoryIndex.value++
    }
  }

  // 日時フォーマット
  function formatDate(timestamp: number): string {
    const date = new Date(timestamp)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>
