<!-- src/MainGenerator/ui/FlightSeat/parts/layouts/SeatLayoutNineViewers.vue -->
<template>
  <div class="flex flex-col items-center">
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
          :colorFrom="checkerColor(i)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from './SeatCell.vue'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
  }>()

  const rows = 3
  const cols = 3

  const displaySeats = computed(() => Array.from({ length: rows * cols }, (_, i) => props.seats[i] ?? null))

  const checkerColor = (i: number): DaisyUIColorType => (i % 2 === 0 ? 'info' : 'warning')
</script>
