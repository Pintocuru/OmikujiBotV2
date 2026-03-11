<!-- src/MainGenerator/ui/FlightSeat/layouts/SeatGridCustom.vue -->
<template>
  <div class="flex flex-col gap-3 items-center">
    <div
      v-for="(count, row) in seatLayout"
      :key="row"
      class="grid gap-3 mx-auto"
      :style="{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, maxWidth: `${count * 5}rem` }"
    >
      <SeatCell
        v-for="i in count"
        :key="displaySeats[rowOffsets[row] + i - 1]?.lastVisit + '-' + displaySeats[rowOffsets[row] + i - 1]?.tc"
        :seat="displaySeats[rowOffsets[row] + i - 1]"
        :index="rowOffsets[row] + i - 1"
        :statKey="statKey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SeatCell from './SeatCell.vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'

  const props = defineProps<{
    seats: (UserStatsRecord | null)[]
    customLayout: number[]
    layout?: string
    rows?: number
    cols?: number
    statKey: StatKeyNum | null
  }>()

  // カスタム配列をそのまま使用
  const seatLayout = computed(() => props.customLayout)

  // 総座席数を計算
  const totalSeats = computed(() => seatLayout.value.reduce((sum, n) => sum + n, 0))

  // 表示用の座席配列
  const displaySeats = computed(() => Array.from({ length: totalSeats.value }, (_, i) => props.seats[i] ?? null))

  // 各行の開始インデックスを計算
  const rowOffsets = computed(() => {
    let sum = 0
    return seatLayout.value.map((n) => {
      const cur = sum
      sum += n
      return cur
    })
  })
</script>
