<!-- src/MainGenerator/ui/FlightSeat/layouts/SeatFlightSeat.vue -->
<template>
  <div class="flex flex-col items-center gap-1">
    <!-- ファースト -->
    <div class="w-full flex flex-col items-center gap-2">
      <div class="relative flex items-center gap-2 px-4 py-1">
        <span class="text-yellow-400 text-sm">✦</span>
        <div class="text-xs font-black tracking-[0.3em] uppercase">👑 First Class 👑</div>
        <span class="text-yellow-400 text-sm">✦</span>
      </div>

      <div class="relative rounded-xl px-4 py-3 w-fit">
        <div class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${layout[0]}, 5rem)` }">
          <SeatCell
            v-for="col in layout[0]"
            :key="seatAt(0, col - 1)?.lastVisit ?? `fc-${col}`"
            :seat="seatAt(0, col - 1)"
            :index="getIndex(0, col - 1)"
            :statKey="statKey"
            colorFrom="warning"
            colorTo="neutral"
            :colorReverse="true"
          />
        </div>
      </div>
    </div>

    <!-- 区切り -->
    <div class="w-full flex items-center gap-2 my-2 px-2">
      <div class="flex-1 border-t border-base-content/20" />
      <span class="text-xs text-base-content/30">✦ — ✦ — ✦</span>
      <div class="flex-1 border-t border-base-content/20" />
    </div>

    <!-- エコノミー -->
    <div class="w-full flex flex-col items-center gap-2">
      <div class="text-xs font-bold text-base-content/40">Economy</div>

      <div v-for="(count, rowIndex) in economyRows" :key="rowIndex" class="flex gap-1 items-center">
        <!-- 左 -->
        <div class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${Math.ceil(count / 2)}, 5rem)` }">
          <SeatCell
            v-for="col in Math.ceil(count / 2)"
            :key="seatAt(rowIndex + 1, col - 1)?.lastVisit ?? `el-${rowIndex}-${col}`"
            :seat="seatAt(rowIndex + 1, col - 1)"
            :index="getIndex(rowIndex + 1, col - 1)"
            :statKey="statKey"
            :colorFrom="checkerColorEco(rowIndex, col - 1)"
          />
        </div>

        <!-- 通路 -->
        <div class="w-5 text-center text-base-content/20 text-xs">|</div>

        <!-- 右 -->
        <div class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${Math.floor(count / 2)}, 5rem)` }">
          <SeatCell
            v-for="col in Math.floor(count / 2)"
            :key="seatAt(rowIndex + 1, col + Math.ceil(count / 2) - 1)?.lastVisit ?? `er-${rowIndex}-${col}`"
            :seat="seatAt(rowIndex + 1, col + Math.ceil(count / 2) - 1)"
            :index="getIndex(rowIndex + 1, col + Math.ceil(count / 2) - 1)"
            :statKey="statKey"
            :colorFrom="checkerColorEco(rowIndex, col + Math.ceil(count / 2) - 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from './SeatCell.vue'
  import { DaisyUIColorType, DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
    customLayout?: number[]
  }>()

  // 例: [4, 6, 6, 6]
  const layout = computed(() => props.customLayout ?? [4, 6, 6, 6])

  // エコノミー行
  const economyRows = computed(() => layout.value.slice(1))

  // index計算
  const rowOffset = (row: number) => layout.value.slice(0, row).reduce((sum, n) => sum + n, 0)

  const getIndex = (row: number, col: number) => rowOffset(row) + col

  const seatAt = (row: number, col: number): UserStatsRecord | null => props.seats[getIndex(row, col)] ?? null

  const checkerColorEco = (row: number, col: number): DaisyUIColorType =>
    (row + col) % 2 === 0 ? (props.color.backFrom ?? 'warning') : (props.color.backTo ?? 'info')
</script>
