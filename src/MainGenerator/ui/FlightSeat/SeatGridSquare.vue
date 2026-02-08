<!-- src/MainGenerator/ui/FlightSeat/SeatGridSquare.vue -->
<template>
  <div
    class="grid gap-3 mx-auto"
    :style="{ 
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      maxWidth: `${cols * 5}rem`
    }"
  >
    <SeatCell
      v-for="(seat, i) in displaySeats"
      :key="i"
      :seat="seat"
      :index="i"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
import SeatCell from './SeatCell.vue'

const props = defineProps<{
  seats: (UserVisitRecord | null)[]
  rows: number
  cols: number
}>()

const displaySeats = computed(() =>
  Array.from({ length: props.rows * props.cols }, (_, i) => props.seats[i] ?? null)
)
</script>