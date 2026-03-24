<!-- src/MainGenerator/ui/FlightSeat/parts/FlightSeatSelector.vue -->
<template>
  <div class="flex justify-center">
    <div class="card bg-base-200 p-4 rounded-xl shadow-xl space-y-2" :data-theme="color.daisyUiTheme">
      <h2 v-if="label" class="text-xl font-bold text-center">
        {{ label }}
      </h2>
      <component
        :is="layoutComponent"
        :key="totalSeats"
        :color="color"
        :seats="seats"
        :statKey="statKey"
        :customLayout="customLayout"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { StatKeyNum, UserStatsRecord, FlightComponentKind } from '@/types'
  import NineViewers from '../layouts/SeatNineViewers.vue'
  import Bingo from '../layouts/SeatBingo.vue'
  import FlightSeat from '../layouts/SeatFlightSeat.vue'
  import Graduation from '../layouts/SeatGraduation.vue'
  import FerrisWheel from '../layouts/SeatFerrisWheel.vue'
  import GoldenCrowd from '../layouts/SeatGoldenCrowd.vue'
  import { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    label: string
    seats: (UserStatsRecord | null)[]
    kind: FlightComponentKind
    customLayout?: number[]
    statKey: StatKeyNum | null
    totalSeats: number
  }>()

  const COMPONENT_MAP = {
    nineViewers: NineViewers,
    bingo: Bingo,
    flightSeat: FlightSeat,
    graduation: Graduation,
    ferrisWheel: FerrisWheel,
    goldenCrowd: GoldenCrowd,
  } as const

  const layoutComponent = computed(() => COMPONENT_MAP[props.kind] ?? NineViewers)
</script>
