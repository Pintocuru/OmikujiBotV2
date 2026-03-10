<!-- src/MainGenerator/ui/FlightSeat/parts/layouts/SeatLayoutGraduation.vue -->
<template>
  <div class="flex flex-col items-center gap-3">
    <!-- タイトル装飾 -->
    <div class="flex items-center gap-2 w-full px-4">
      <div class="flex-1 border-t border-base-content/20" />
      <span class="text-sm font-bold text-base-content/50 tracking-[0.3em]">卒　業　記　念</span>
      <div class="flex-1 border-t border-base-content/20" />
    </div>

    <!-- 後列 (12人) -->
    <div class="flex flex-col items-center gap-1">
      <div class="text-xs text-base-content/30 tracking-widest">— 後列 —</div>
      <SeatGridCustom :seats="backRow" :customLayout="[12]" :statKey="statKey" />
    </div>

    <!-- 前列 (13人) -->
    <div class="flex flex-col items-center gap-1">
      <div class="text-xs text-base-content/30 tracking-widest">— 前列 —</div>
      <SeatGridCustom :seats="frontRow" :customLayout="[13]" :statKey="statKey" />
    </div>

    <!-- 壇上 (12人) -->
    <div class="flex flex-col items-center gap-1">
      <div class="text-xs text-base-content/30 tracking-widest">— 壇上 —</div>
      <div class="relative">
        <div class="absolute inset-0 rounded-xl border-2 border-warning/40 pointer-events-none" />
        <SeatGridCustom :seats="stageRow" :customLayout="[12]" :statKey="statKey" />
      </div>
    </div>

    <!-- フッター装飾 -->
    <div class="flex items-center gap-2 w-full px-4">
      <div class="flex-1 border-t border-base-content/20" />
      <span class="text-xs text-base-content/30">✦ ✦ ✦</span>
      <div class="flex-1 border-t border-base-content/20" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatGridCustom from './SeatGridCustom.vue'

  const props = defineProps<{
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
  }>()

  // layout=[12, 13, 12]: 後列12 / 前列13 / 壇上12
  const backRow = computed(() => props.seats.slice(0, 12))
  const frontRow = computed(() => props.seats.slice(12, 25))
  const stageRow = computed(() => props.seats.slice(25, 37))
</script>
