<!-- src/MainGenerator/ui/FlightSeat/parts/SeatSelector.vue -->
<template>
  <div class="seat-selector-wrapper">
    <component
      :is="gridComponent"
      :seats="seats"
      :layout="componentConfig.layout"
      :rows="componentConfig.rows"
      :cols="componentConfig.cols"
      :customLayout="parsedCustomLayout"
      :circleSeats="componentConfig.circleSeats"
      :statKey="statKey"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { SeatLayout, StatKeyNum, UserStatsRecord, FlightSeatComponentConfig } from '@/types'
  import SeatGridSquare from './SeatGridSquare.vue'
  import SeatGridCircle from './SeatGridCircle.vue'
  import SeatGridCustom from './SeatGridCustom.vue'

  const props = defineProps<{
    seats: (UserStatsRecord | null)[]
    componentConfig: FlightSeatComponentConfig
    statKey: StatKeyNum | null
  }>()

  const gridComponent = computed(() => {
    switch (props.componentConfig.layout) {
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

  const parsedCustomLayout = computed(() => {
    if (!props.componentConfig.customLayout) return []
    try {
      return JSON.parse(props.componentConfig.customLayout) as number[]
    } catch {
      return []
    }
  })
</script>

<style scoped>
  .seat-selector-wrapper {
    border: 2px solid oklch(var(--bc) / 0.2);
    border-radius: var(--rounded-box, 1rem);
    background: oklch(var(--b1) / 0.5);
    padding: 0.75rem;
    box-shadow:
      inset 0 2px 4px oklch(var(--bc) / 0.05),
      0 1px 2px oklch(var(--bc) / 0.1);
  }
</style>
