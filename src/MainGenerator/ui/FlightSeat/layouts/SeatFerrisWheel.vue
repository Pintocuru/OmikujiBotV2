<!-- src/MainGenerator/ui/FlightSeat/layouts/SeatFerrisWheel.vue -->
<template>
  <div class="flex flex-col items-center gap-0">
    <div class="relative" :style="{ width: diameter + 'px', height: diameter + 'px' }">
      <!-- スポーク SVG -->
      <svg
        class="absolute inset-0 pointer-events-none"
        :width="diameter"
        :height="diameter"
        :viewBox="`0 0 ${diameter} ${diameter}`"
      >
        <circle
          :cx="radius"
          :cy="radius"
          :r="radius - seatSize / 2"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          class="text-base-content/20"
        />
        <g class="ferris-rotate-svg" :style="{ transformOrigin: `${radius}px ${radius}px` }">
          <line
            v-for="i in seatsCount"
            :key="i"
            :x1="radius"
            :y1="radius"
            :x2="spokeEnd(i).x"
            :y2="spokeEnd(i).y"
            stroke="currentColor"
            stroke-width="1.5"
            class="text-base-content/15"
          />
        </g>
        <circle :cx="radius" :cy="radius" r="12" class="fill-base-content/30" />
        <circle :cx="radius" :cy="radius" r="5" class="fill-base-content/60" />
      </svg>

      <!-- 円周の座席（回転） -->
      <div class="absolute inset-0 ferris-rotate">
        <div
          v-for="(seat, i) in circleSeats"
          :key="seat ? seat.lastVisit : `rim-${i}`"
          class="absolute ferris-counter-rotate"
          :style="getSeatStyle(i)"
        >
          <SeatCell
            :key="seat?.lastVisit ?? `empty-${i}`"
            :seat="seat"
            :index="i"
            :statKey="statKey"
            :colorFrom="i % 2 === 0 ? (color.backFrom ?? 'warning') : (color.backTo ?? 'info')"
          />
        </div>
      </div>

      <!-- 中央：大きなSeatCell -->
      <div
        class="absolute ferris-rotate"
        :style="{
          left: radius - centerSize / 2 + 'px',
          top: radius - centerSize / 2 + 'px',
        }"
      >
        <SeatCell
          :key="centerSeat?.lastVisit ?? 'center'"
          :seat="centerSeat"
          :index="seatsCount"
          :statKey="statKey"
          :size="centerSize"
          colorFrom="warning"
          colorTo="neutral"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from './SeatCell.vue'
  import { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
    circleSeats?: number
  }>()

  const seatsCount = computed(() => props.circleSeats ?? 12)
  const diameter = 400
  const radius = diameter / 2
  const seatSize = 80
  const centerSize = 220

  // 円周の座席リスト（seatsCount分）
  const circleSeats = computed(() => Array.from({ length: seatsCount.value }, (_, i) => props.seats[i] ?? null))

  // 中央に表示するユーザー（円周の次）
  const centerSeat = computed(() => props.seats[seatsCount.value] ?? null)

  const getSeatStyle = (index: number) => {
    const angle = (index * 360) / seatsCount.value - 90
    const rad = (angle * Math.PI) / 180
    const x = radius + radius * Math.cos(rad) - seatSize / 2
    const y = radius + radius * Math.sin(rad) - seatSize / 2
    return { left: x + 'px', top: y + 'px', width: seatSize + 'px' }
  }

  const spokeEnd = (i: number) => {
    const angle = ((i - 1) * 360) / seatsCount.value - 90
    const rad = (angle * Math.PI) / 180
    const r = radius - seatSize / 2
    return { x: radius + r * Math.cos(rad), y: radius + r * Math.sin(rad) }
  }
</script>

<style scoped>
  @keyframes ferris-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes ferris-spin-reverse {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
  .ferris-rotate {
    animation: ferris-spin 20s linear infinite;
    transform-origin: center center;
  }
  .ferris-counter-rotate {
    animation: ferris-spin-reverse 20s linear infinite;
    transform-origin: center center;
  }
  .ferris-rotate-svg {
    animation: ferris-spin 20s linear infinite;
  }
</style>
