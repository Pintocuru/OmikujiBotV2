<!-- src/MainGenerator/ui/FlightSeat/layouts/SeatGridSquare.vue -->
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
        :key="seat ? seat.lastVisit : i"
        :seat="seat"
        :index="i"
        :statKey="statKey"
        :colorFrom="colorFrom"
        :colorTo="colorTo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SeatCell from './SeatCell.vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    seats: (UserStatsRecord | null)[]
    rows: number
    cols: number
    statKey: StatKeyNum | null
    colorFrom?: DaisyUIColorType
    colorTo?: DaisyUIColorType
  }>()

  const displaySeats = computed(() => Array.from({ length: props.rows * props.cols }, (_, i) => props.seats[i] ?? null))
</script>
