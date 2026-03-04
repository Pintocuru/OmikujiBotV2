<!-- src/MainGenerator/ui/FlightSeat/parts/SeatGridCustom.vue -->
<template>
  <div class="flex flex-col gap-3 items-center">
    <div
      v-for="(count, row) in seatLayout"
      :key="row"
      class="grid gap-3 mx-auto w-full"
      :style="{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, maxWidth: `${count * 5}rem` }"
    >
      <SeatCell
        v-for="i in count"
        :key="i"
        :seat="displaySeats[rowOffsets[row] + i - 1]"
        :index="rowOffsets[row] + i - 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SeatCell from './SeatCell.vue'
  import { UserNameType } from '@shared/types'

  const props = defineProps<{
    seats: (UserNameType | null)[]
    customLayout: number[]
    layout?: string
    rows?: number
    cols?: number
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
