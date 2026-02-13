<!-- SeatGridCircle.vue -->
<template>
  <div class="relative mx-auto" :style="{ width: diameter + 'px', height: diameter + 'px' }">
    <div v-for="(seat, i) in displaySeats" :key="i" class="absolute" :style="getSeatPosition(i)">
      <SeatCell :seat="seat" :index="i" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import SeatCell from './SeatCell.vue'

  const props = defineProps<{
    seats: (UserVisitRecord | null)[]
    circleSeats: number
  }>()

  const diameter = 400 // 円の直径
  const radius = diameter / 2
  const seatSize = 80 // 座席の幅

  const displaySeats = computed(() => Array.from({ length: props.circleSeats }, (_, i) => props.seats[i] ?? null))

  const getSeatPosition = (index: number) => {
    const angle = (index * 360) / props.circleSeats - 90 // -90で12時位置スタート
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
