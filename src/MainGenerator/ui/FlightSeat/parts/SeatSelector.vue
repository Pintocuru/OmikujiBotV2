<!-- src/MainGenerator/ui/FlightSeat/parts/SeatSelector.vue -->
<template>
  <div class="flex justify-center">
    <div class="card bg-base-200 p-4 space-y-2" :data-theme="color">
      <h2 v-if="label" class="text-xl font-bold text-center">
        {{ label }}
      </h2>
      <component :is="layoutComponent" :seats="seats" :statKey="statKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { StatKeyNum, UserStatsRecord, FlightSeatComponentConfig } from '@/types'
  import SeatLayoutNineViewers from '../layouts/SeatNineViewers.vue'
  import SeatLayoutBingo from '../layouts/SeatBingo.vue'
  import SeatLayoutFlightSeat from '../layouts/SeatFlightSeat.vue'
  import SeatLayoutGraduation from '../layouts/SeatGraduation.vue'
  import SeatLayoutFerrisWheel from '../layouts/SeatFerrisWheel.vue'
  import { ThemeType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    color: ThemeType
    label: string
    seats: (UserStatsRecord | null)[]
    componentConfig: FlightSeatComponentConfig
    statKey: StatKeyNum | null
  }>()

  const layoutComponent = computed(() => {
    switch (props.componentConfig.kind) {
      case 'nineViewers':
        return SeatLayoutNineViewers
      case 'bingo':
        return SeatLayoutBingo
      case 'flightSeat':
        return SeatLayoutFlightSeat
      case 'graduation':
        return SeatLayoutGraduation
      case 'ferrisWheel':
        return SeatLayoutFerrisWheel
      default:
        return SeatLayoutNineViewers
    }
  })
</script>
