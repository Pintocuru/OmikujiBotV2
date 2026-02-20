<!-- src/MainGenerator/ui/FlightSeat/parts/SeatGridSquare.vue -->
<template>
  <div
    class="grid gap-3 mx-auto"
    :style="{
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      maxWidth: `${cols * 5}rem`,
    }"
  >
    <SeatCell v-for="(seat, i) in displaySeats" :key="i" :seat="seat" :index="i" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SeatCell from './SeatCell.vue'
  import { UserNameType } from '@shared/types'

  const props = defineProps<{
    seats: (UserNameType | null)[]
    rows: number
    cols: number
  }>()

  const displaySeats = computed(() => Array.from({ length: props.rows * props.cols }, (_, i) => props.seats[i] ?? null))
</script>
