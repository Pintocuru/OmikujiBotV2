<!-- src/MainGenerator/ui/FlightSeat/parts/layouts/SeatLayoutFlightSeat.vue -->
<template>
  <div class="flex flex-col items-center gap-1">
    <!-- 機首 -->
    <div class="text-4xl leading-none select-none mb-1">✈️</div>

    <!-- ファーストクラス (4席) -->
    <div class="w-full flex flex-col items-center gap-1">
      <div class="text-xs font-bold text-base-content/40 tracking-widest uppercase">First Class</div>
      <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(4, 5rem)' }">
        <SeatCell
          v-for="i in 4"
          :key="seats[i - 1]?.lastVisit"
          :seat="seats[i - 1] ?? null"
          :index="i - 1"
          :statKey="statKey"
        />
      </div>
    </div>

    <!-- 通路セパレーター -->
    <div class="w-full flex items-center gap-2 my-1 px-2">
      <div class="flex-1 border-t-2 border-dashed border-base-content/20" />
      <span class="text-xs text-base-content/30 font-mono">— — —</span>
      <div class="flex-1 border-t-2 border-dashed border-base-content/20" />
    </div>

    <!-- エコノミー (6席 × 3列) -->
    <div class="w-full flex flex-col items-center gap-2">
      <div class="text-xs font-bold text-base-content/40 tracking-widest uppercase">Economy</div>
      <div v-for="(count, row) in [6, 6, 6]" :key="'e-' + row" class="flex gap-1 items-center">
        <!-- 左3席 -->
        <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(3, 5rem)' }">
          <SeatCell
            v-for="col in 3"
            :key="seats[4 + row * 6 + (col - 1)]?.lastVisit"
            :seat="seats[4 + row * 6 + (col - 1)] ?? null"
            :index="4 + row * 6 + (col - 1)"
            :statKey="statKey"
          />
        </div>
        <!-- 通路 -->
        <div class="w-5 text-center text-base-content/20 text-xs font-mono select-none">|</div>
        <!-- 右3席 -->
        <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(3, 5rem)' }">
          <SeatCell
            v-for="col in 3"
            :key="seats[4 + row * 6 + 3 + (col - 1)]?.lastVisit"
            :seat="seats[4 + row * 6 + 3 + (col - 1)] ?? null"
            :index="4 + row * 6 + 3 + (col - 1)"
            :statKey="statKey"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from './SeatCell.vue'

  defineProps<{
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
  }>()
</script>
