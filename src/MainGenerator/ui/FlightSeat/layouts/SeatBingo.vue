<!-- src/MainGenerator/ui/FlightSeat/layouts/SeatBingo.vue -->
<template>
  <div class="flex flex-col items-center gap-2">
    <!-- ヘッダー: B I N G O -->
    <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(5, 5rem)' }">
      <div
        v-for="letter in ['B', 'I', 'N', 'G', 'O']"
        :key="letter"
        class="flex items-center justify-center h-8 rounded font-black text-xl tracking-widest bg-warning text-warning-content"
      >
        {{ letter }}
      </div>
    </div>

    <!-- グリッド本体 (5×5、中央=13番目はFREE) -->
    <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(5, 5rem)' }">
      <template v-for="i in 25" :key="i">
        <!-- 中央マス (13番目 = index 12) は FREE -->
        <div
          v-if="i === 13"
          class="relative flex items-center justify-center rounded-lg bg-accent text-accent-content font-black text-lg"
          style="width: 80px; height: 80px"
        >
          FREE
        </div>
        <SeatCell
          v-else
          :key="seatAt(i) ? seatAt(i)!.lastVisit : `empty-${i}`"
          :seat="seatAt(i)"
          :index="slotIndex(i)"
          :seatNumber="slotIndex(i) + 1"
          :statKey="statKey"
          :colorFrom="checkerColor(i)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from './SeatCell.vue'
  import { DaisyUIColorType, DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
  }>()

  const slotIndex = (i: number) => (i < 13 ? i - 1 : i - 2)
  const seatAt = (i: number): UserStatsRecord | null => props.seats[slotIndex(i)] ?? null

  /**
   * 市松模様: 行・列の偶奇XORで warning / info を切り替え
   * i は 1〜25 (1-indexed)
   */
  const checkerColor = (i: number): DaisyUIColorType => {
    const row = Math.floor((i - 1) / 5)
    const col = (i - 1) % 5
    return (row + col) % 2 === 0 ? (props.color.backFrom ?? 'primary') : (props.color.backTo ?? 'secondary')
  }
</script>
