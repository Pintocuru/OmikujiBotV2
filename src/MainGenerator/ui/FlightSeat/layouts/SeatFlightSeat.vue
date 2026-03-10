<!-- src/MainGenerator/ui/FlightSeat/parts/layouts/SeatLayoutFlightSeat.vue -->
<template>
  <div class="flex flex-col items-center gap-1">
    <!-- ファーストクラス -->
    <div class="w-full flex flex-col items-center gap-2">
      <!-- 豪華なヘッダー -->
      <div class="relative flex items-center gap-2 px-4 py-1">
        <span class="text-yellow-400 text-sm select-none">✦</span>
        <div class="text-xs font-black tracking-[0.3em] uppercase">👑 First Class 👑</div>
        <span class="text-yellow-400 text-sm select-none">✦</span>
      </div>

      <!-- 金色グラデーション背景帯 -->
      <div
        class="relative rounded-xl px-4 py-3 w-fit"
        style="
          background: linear-gradient(135deg, #1a1200 0%, #3d2b00 40%, #1a1200 100%);
          border: 1px solid #b8860b;
          box-shadow:
            0 0 18px 2px #b8860b55,
            inset 0 0 12px #b8860b22;
        "
      >
        <!-- キラキラ装飾 -->
        <div class="absolute top-1 left-2 text-yellow-400/60 text-xs select-none">✦</div>
        <div class="absolute top-1 right-2 text-yellow-400/60 text-xs select-none">✦</div>
        <div class="absolute bottom-1 left-4 text-yellow-400/40 text-[10px] select-none">✦</div>
        <div class="absolute bottom-1 right-4 text-yellow-400/40 text-[10px] select-none">✦</div>

        <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(4, 5rem)' }">
          <SeatCell
            v-for="i in 4"
            :key="seats[i - 1]?.lastVisit ?? `fc-${i}`"
            :seat="seats[i - 1] ?? null"
            :index="i - 1"
            :statKey="statKey"
            :colorReverse="true"
            colorFrom="neutral"
          />
        </div>
      </div>
    </div>

    <!-- 通路セパレーター (2重線・豪華) -->
    <div class="w-full flex items-center gap-2 my-2 px-2">
      <div class="flex-1 flex flex-col gap-0.5">
        <div class="border-t border-dashed border-base-content/30" />
        <div class="border-t border-dashed border-base-content/15" />
      </div>
      <span class="text-xs text-base-content/30 font-mono tracking-widest">✦ — ✦ — ✦</span>
      <div class="flex-1 flex flex-col gap-0.5">
        <div class="border-t border-dashed border-base-content/30" />
        <div class="border-t border-dashed border-base-content/15" />
      </div>
    </div>

    <!-- エコノミー -->
    <div class="w-full flex flex-col items-center gap-2">
      <div class="text-xs font-bold text-base-content/40 tracking-widest uppercase">Economy</div>
      <div v-for="(_, row) in [6, 6, 6]" :key="'e-' + row" class="flex gap-1 items-center">
        <!-- 左3席 -->
        <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(3, 5rem)' }">
          <SeatCell
            v-for="col in 3"
            :key="seats[4 + row * 6 + (col - 1)]?.lastVisit ?? `el-${row}-${col}`"
            :seat="seats[4 + row * 6 + (col - 1)] ?? null"
            :index="4 + row * 6 + (col - 1)"
            :statKey="statKey"
            :colorFrom="checkerColorEco(row, col - 1)"
          />
        </div>
        <!-- 通路 -->
        <div class="w-5 text-center text-base-content/20 text-xs font-mono select-none">|</div>
        <!-- 右3席 -->
        <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(3, 5rem)' }">
          <SeatCell
            v-for="col in 3"
            :key="seats[4 + row * 6 + 3 + (col - 1)]?.lastVisit ?? `er-${row}-${col}`"
            :seat="seats[4 + row * 6 + 3 + (col - 1)] ?? null"
            :index="4 + row * 6 + 3 + (col - 1)"
            :statKey="statKey"
            :colorFrom="checkerColorEco(row, col + 2)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from './SeatCell.vue'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  defineProps<{
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
  }>()

  /** エコノミー: 行・列XORで市松模様 */
  const checkerColorEco = (row: number, col: number): DaisyUIColorType => ((row + col) % 2 === 0 ? 'warning' : 'info')
</script>
