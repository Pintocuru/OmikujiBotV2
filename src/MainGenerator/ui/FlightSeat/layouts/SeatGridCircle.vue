<!-- src/MainGenerator/ui/FlightSeat/layouts/SeatGridCircle.vue -->
<template>
  <div class="relative mx-auto" :style="{ width: diameter + 'px', height: diameter + 'px' }">
    <!-- 回転する外輪（座席ごと） -->
    <div class="absolute inset-0" :class="rotating ? 'ferris-rotate' : ''">
      <div
        v-for="(seat, i) in displaySeats"
        :key="seat ? seat.userId + '-' + i : i"
        class="absolute"
        :style="getSeatPosition(i)"
      >
        <!-- 座席自体は常に正立（外輪の回転を打ち消す） -->
        <div :class="rotating ? 'ferris-counter-rotate' : ''">
          <SeatCell
            :key="seat?.lastVisit"
            :seat="seat"
            :index="i"
            :statKey="statKey"
            :colorFrom="colorFrom"
            :colorTo="colorTo"
          />
        </div>
      </div>
    </div>

    <!-- 中央スロット（軸など装飾用） -->
    <slot name="center" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SeatCell from './SeatCell.vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    seats: (UserStatsRecord | null)[]
    circleSeats: number
    statKey: StatKeyNum | null
    rotating?: boolean
    colorFrom?: DaisyUIColorType
    colorTo?: DaisyUIColorType
  }>()

  const diameter = 400
  const radius = diameter / 2
  const seatSize = 80

  const displaySeats = computed(() => Array.from({ length: props.circleSeats }, (_, i) => props.seats[i] ?? null))

  const getSeatPosition = (index: number) => {
    const angle = (index * 360) / props.circleSeats - 90
    const rad = (angle * Math.PI) / 180
    const x = radius + radius * Math.cos(rad) - seatSize / 2
    const y = radius + radius * Math.sin(rad) - seatSize / 2
    return {
      left: x + 'px',
      top: y + 'px',
      width: seatSize + 'px',
    }
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
</style>
