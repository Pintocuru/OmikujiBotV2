<!-- src/MainGenerator/ui/FlightSeat/SeatGridPyramid.vue -->
<template>
  <div class="flex flex-col gap-3 items-center">
    <div
      v-for="(count, row) in seatLayout"
      :key="row"
      class="grid gap-3"
      :style="{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }"
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
import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
import { calculateSeatLayout, calculateTotalSeats, type SeatLayout } from './seatLayoutUtils'
import SeatCell from './SeatCell.vue'

const props = defineProps<{
  seats: (UserVisitRecord | null)[]
  layout: SeatLayout
  rows: number
  cols?: number  // pyramidでは使わないがpropsとして受け取る
}>()

const seatLayout = computed(() =>
  calculateSeatLayout(props.layout, props.rows, 0)
)

const totalSeats = computed(() =>
  calculateTotalSeats(props.layout, props.rows, 0)
)

const displaySeats = computed(() =>
  Array.from({ length: totalSeats.value }, (_, i) => props.seats[i] ?? null)
)

const rowOffsets = computed(() => {
  let sum = 0
  return seatLayout.value.map(n => {
    const cur = sum
    sum += n
    return cur
  })
})
</script>