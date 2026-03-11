<!-- src/MainGenerator/ui/SocialRoster/parts/SocialRosterGrid.vue -->
<template>
  <div class="grid w-full" :style="{ gridTemplateColumns: `repeat(auto-fill, ${cellPx}px)` }">
    <SeatCell v-for="user in users" :key="user.userId" :seat="user" :index="0" :statKey="statKey" :size="cellPx" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from '@main/ui/FlightSeat/layouts/SeatCell.vue'

  const props = defineProps<{
    users: UserStatsRecord[]
    cellSize: string // 'h-8' | 'h-10' | 'h-12' | 'h-16' | 'h-20' | 'h-24'
    statKey: StatKeyNum | null
  }>()

  const cellSizePxMap: Record<string, number> = {
    'h-8': 32,
    'h-10': 40,
    'h-12': 48,
    'h-16': 64,
    'h-20': 80,
    'h-24': 96,
  }

  const cellPx = computed(() => cellSizePxMap[props.cellSize] ?? 64)
</script>
