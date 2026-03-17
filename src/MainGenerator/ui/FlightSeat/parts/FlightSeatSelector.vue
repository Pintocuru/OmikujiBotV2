<!-- src/MainGenerator/ui/FlightSeat/parts/FlightSeatSelector.vue -->
<template>
  <div class="flex justify-center">
    <div class="card bg-base-200 p-4 rounded-xl shadow-xl space-y-2" :data-theme="color">
      <h2 v-if="label" class="text-xl font-bold text-center">
        {{ label }}
      </h2>
      <component :is="layoutComponent" :seats="seats" :statKey="statKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { StatKeyNum, UserStatsRecord, FlightComponentKind } from '@/types'
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
    kind: FlightComponentKind
    customLayout?: number[]
    statKey: StatKeyNum | null
  }>()

  const COMPONENT_MAP = {
    nineViewers: SeatLayoutNineViewers,
    bingo: SeatLayoutBingo,
    flightSeat: SeatLayoutFlightSeat,
    graduation: SeatLayoutGraduation,
    ferrisWheel: SeatLayoutFerrisWheel,
  } as const

  const layoutComponent = computed(() => {
    return COMPONENT_MAP[props.kind] ?? SeatLayoutNineViewers
  })
</script>
