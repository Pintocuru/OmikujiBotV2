<!-- src/MainGenerator/ui/FlightSeat/SeatGrid.vue -->
<template>
  <component
    :is="gridComponent"
    :seats="seats"
    :layout="layout"
    :rows="rows"
    :cols="cols"
    :customLayout="customLayout"
    :circleSeats="circleSeats"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import type { SeatLayout } from './seatLayoutUtils'
  import SeatGridSquare from './SeatGridSquare.vue'
  import SeatGridStaggered from './SeatGridStaggered.vue'
  import SeatGridCircle from './SeatGridCircle.vue'
  import SeatGridCustom from './SeatGridCustom.vue'

  const props = defineProps<{
    seats: (UserVisitRecord | null)[]
    layout: SeatLayout
    rows: number
    cols: number
    customLayout?: number[]
    circleSeats?: number
  }>()

  const gridComponent = computed(() => {
    switch (props.layout) {
      case 'square':
        return SeatGridSquare
      case 'staggered':
        return SeatGridStaggered
      case 'circle':
        return SeatGridCircle
      case 'custom':
        return SeatGridCustom
      default:
        return SeatGridSquare
    }
  })
</script>
