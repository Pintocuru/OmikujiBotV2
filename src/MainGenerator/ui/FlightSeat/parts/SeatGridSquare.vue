<!-- src/MainGenerator/ui/FlightSeat/parts/SeatGridSquare.vue -->
<template>
  <div class="flex justify-center">
    <div
      class="grid gap-3 mx-auto"
      :style="{
        gridTemplateColumns: `repeat(${cols}, 5rem)`,
      }"
    >
      <SeatCell
        v-for="(seat, i) in displaySeats"
        :key="seat ? seat.userId + '-' + i : i"
        :seat="seat"
        :index="i"
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
    rows: number
    cols: number
    statKey: StatKeyNum | null
  }>()

  const displaySeats = computed(() => Array.from({ length: props.rows * props.cols }, (_, i) => props.seats[i] ?? null))
</script>
