<!-- src/MainGenerator/ui/FlightSeat/parts/layouts/SeatLayoutNineViewers.vue -->
<template>
  <div class="flex flex-col items-center">
    <SeatGridSquare :seats="seats" :rows="3" :cols="3" :statKey="statKey" />
  </div>
</template>

<script setup lang="ts">
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatGridSquare from './SeatGridSquare.vue'

  defineProps<{
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
  }>()
</script>
