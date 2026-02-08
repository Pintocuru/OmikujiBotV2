<!-- src/MainGenerator/ui/FlightSeat/SeatGrid.vue -->
<template>
  <component
    :is="gridComponent"
    :seats="seats"
    :layout="layout"
    :rows="rows"
    :cols="cols"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
import type { SeatLayout } from './seatLayoutUtils'
import SeatGridSquare from './SeatGridSquare.vue'
import SeatGridPyramid from './SeatGridPyramid.vue'

const props = defineProps<{
  seats: (UserVisitRecord | null)[]
  layout: SeatLayout
  rows: number
  cols: number
}>()

const gridComponent = computed(() => {
  return props.layout === 'square' ? SeatGridSquare : SeatGridPyramid
})
</script>