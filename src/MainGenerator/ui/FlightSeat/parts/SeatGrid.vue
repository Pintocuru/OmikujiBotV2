<!-- src/MainGenerator/ui/FlightSeat/parts/SeatGrid.vue -->
<template>
  <component
    :is="gridComponent"
    :seats="seats"
    :layout="layout"
    :rows="rows"
    :cols="cols"
    :customLayout="customLayout"
    :circleSeats="circleSeats"
    :statKey="statKey"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { SeatLayout, StatKeyNum, UserStatsRecord } from '@/types'
  import SeatGridSquare from './SeatGridSquare.vue'
  import SeatGridCircle from './SeatGridCircle.vue'
  import SeatGridCustom from './SeatGridCustom.vue'

  const props = defineProps<{
    seats: (UserStatsRecord | null)[]
    layout: SeatLayout
    rows: number
    cols: number
    customLayout?: number[]
    circleSeats?: number
    statKey: StatKeyNum | null
  }>()

  const gridComponent = computed(() => {
    switch (props.layout) {
      case 'square':
        return SeatGridSquare
      case 'circle':
        return SeatGridCircle
      case 'custom':
        return SeatGridCustom
      default:
        return SeatGridSquare
    }
  })
</script>
