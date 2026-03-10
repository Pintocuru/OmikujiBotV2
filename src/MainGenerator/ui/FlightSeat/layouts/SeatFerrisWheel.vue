<!-- src/MainGenerator/ui/FlightSeat/parts/layouts/SeatLayoutFerrisWheel.vue -->
<template>
  <div class="flex flex-col items-center gap-0">
    <!-- 観覧車本体 -->
    <div class="relative" :style="{ width: diameter + 'px', height: diameter + 'px' }">
      <!-- スポーク（SVG で描画、外輪と同期して回転） -->
      <svg
        class="absolute inset-0 pointer-events-none"
        :width="diameter"
        :height="diameter"
        :viewBox="`0 0 ${diameter} ${diameter}`"
      >
        <!-- 外輪リム -->
        <circle
          :cx="radius"
          :cy="radius"
          :r="radius - seatSize / 2"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          class="text-base-content/20"
        />
        <!-- スポーク -->
        <g :class="'ferris-rotate-svg'" :style="{ transformOrigin: `${radius}px ${radius}px` }">
          <line
            v-for="i in circleSeats"
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
        <!-- 中央ハブ -->
        <circle :cx="radius" :cy="radius" r="12" class="fill-base-content/30" />
        <circle :cx="radius" :cy="radius" r="5" class="fill-base-content/60" />
      </svg>

      <!-- SeatGridCircle（rotating モード） -->
      <SeatGridCircle :seats="seats" :circleSeats="circleSeats" :statKey="statKey" :rotating="true" />
    </div>

    <!-- 支柱 -->
    <div class="flex items-end justify-center gap-0" :style="{ width: diameter + 'px' }">
      <!-- 左脚 -->
      <div
        class="bg-base-content/30 rounded-sm"
        :style="{
          width: '6px',
          height: '60px',
          transform: 'rotate(15deg)',
          transformOrigin: 'bottom center',
          marginRight: '-3px',
        }"
      />
      <!-- 台座 -->
      <div class="bg-base-content/40 rounded-sm" style="width: 40px; height: 10px; margin-bottom: 0" />
      <!-- 右脚 -->
      <div
        class="bg-base-content/30 rounded-sm"
        :style="{
          width: '6px',
          height: '60px',
          transform: 'rotate(-15deg)',
          transformOrigin: 'bottom center',
          marginLeft: '-3px',
        }"
      />
    </div>

    <!-- 地面ライン -->
    <div class="w-full border-t-2 border-base-content/20 mt-1" :style="{ maxWidth: diameter + 'px' }" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatGridCircle from './SeatGridCircle.vue'

  const props = defineProps<{
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
    circleSeats?: number
  }>()

  const circleSeats = computed(() => props.circleSeats ?? 12)
  const diameter = 400
  const radius = diameter / 2
  const seatSize = 80

  // スポークの先端座標（座席の中心に向かって伸ばす）
  const spokeEnd = (i: number) => {
    const angle = ((i - 1) * 360) / circleSeats.value - 90
    const rad = (angle * Math.PI) / 180
    const r = radius - seatSize / 2
    return {
      x: radius + r * Math.cos(rad),
      y: radius + r * Math.sin(rad),
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
  .ferris-rotate-svg {
    animation: ferris-spin 20s linear infinite;
  }
</style>
