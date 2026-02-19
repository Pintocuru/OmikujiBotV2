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
  import { SeatLayout } from '@/types'
  import SeatGridSquare from './SeatGridSquare.vue'
  import SeatGridCircle from './SeatGridCircle.vue'
  import SeatGridCustom from './SeatGridCustom.vue'
  import { UserNameType } from '@shared/types'

  const props = defineProps<{
    seats: (UserNameType | null)[]
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
      case 'circle':
        return SeatGridCircle
      case 'custom':
        return SeatGridCustom
      default:
        return SeatGridSquare
    }
  })
</script>
