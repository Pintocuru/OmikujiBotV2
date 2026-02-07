<!-- src\MainGenerator\ui\FlightSeat\SeatGrid.vue -->
<template>
  <div :style="gridContainerStyle">
    <div
      v-for="(seat, index) in displaySeats"
      :key="index"
      class="aspect-square border-2 rounded-lg flex items-center justify-center p-2 transition-all duration-300"
      :class="getSeatClass(seat, index)"
      :style="{ gridColumn: getSeatGridColumn(index) }"
    >
      <!-- ユーザーが座っている場合 -->
      <div v-if="seat" class="flex flex-col items-center gap-1 w-full">
        <div class="avatar">
          <div class="w-10 h-10 rounded-full">
            <img v-if="seat.profileImage" :src="seat.profileImage" :alt="seat.userName" />
            <div
              v-else
              class="w-full h-full bg-primary flex items-center justify-center text-primary-content font-bold text-lg"
            >
              {{ seat.userName.charAt(0) }}
            </div>
          </div>
        </div>
        <div class="text-xs text-center truncate w-full px-1">
          {{ seat.userName }}
        </div>
      </div>
      <!-- 空席の場合 -->
      <div v-else class="text-base-300 text-sm">
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

  interface Props {
    seats: (UserVisitRecord | null)[]
    layout: 'square' | 'pyramid' | 'inversePyramid'
    rows: number
    cols: number
  }

  const props = defineProps<Props>()

  // 総座席数を計算
  const totalSeats = computed(() => {
    const { layout, rows, cols } = props

    switch (layout) {
      case 'square':
        return rows * cols

      case 'pyramid':
        return (rows * (rows + 1)) / 2

      case 'inversePyramid':
        return (rows * (rows + 1)) / 2

      default:
        return 0
    }
  })

  // 座席配置を計算
  const seatLayout = computed(() => {
    const { layout, rows, cols } = props

    switch (layout) {
      case 'square':
        return Array(rows).fill(cols)

      case 'pyramid':
        return Array.from({ length: rows }, (_, i) => i + 1)

      case 'inversePyramid':
        return Array.from({ length: rows }, (_, i) => rows - i)

      default:
        return []
    }
  })

  // 表示用の座席配列
  const displaySeats = computed(() => {
    return props.seats.slice(0, totalSeats.value)
  })

  // グリッドコンテナのスタイル
  const gridContainerStyle = computed(() => {
    const { layout, cols } = props
    const maxCols = layout === 'square' ? cols : Math.max(...seatLayout.value)

    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))`,
      gap: '0.75rem',
      justifyItems: 'center',
    }
  })

  // 各座席のグリッド配置を計算
  const getSeatGridColumn = (index: number): string => {
    const { layout } = props

    if (layout === 'square') {
      return 'auto'
    }

    // 現在の座席がどの行に属するか計算
    let currentRow = 0
    let seatCount = 0

    for (let i = 0; i < seatLayout.value.length; i++) {
      if (index < seatCount + seatLayout.value[i]) {
        currentRow = i
        break
      }
      seatCount += seatLayout.value[i]
    }

    const rowSeats = seatLayout.value[currentRow]
    const maxCols = Math.max(...seatLayout.value)
    const offset = Math.floor((maxCols - rowSeats) / 2) + 1
    const positionInRow = index - seatCount

    return `${offset + positionInRow} / span 1`
  }

  // 座席のクラスを取得
  function getSeatClass(seat: UserVisitRecord | null, index: number): string {
    const baseClass = 'border-base-300'

    if (seat) {
      return `${baseClass} bg-success/10 border-success`
    }

    if (index % 2 === 0) {
      return `${baseClass} bg-info/5`
    }

    return `${baseClass} bg-warning/5`
  }
</script>