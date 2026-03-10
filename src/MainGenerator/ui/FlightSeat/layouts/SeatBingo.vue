<!-- src/MainGenerator/ui/FlightSeat/parts/layouts/SeatLayoutBingo.vue -->
<template>
  <div class="flex flex-col items-center gap-2">
    <!-- ヘッダー: B I N G O -->
    <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(5, 5rem)' }">
      <div
        v-for="letter in ['B', 'I', 'N', 'G', 'O']"
        :key="letter"
        class="flex items-center justify-center h-8 rounded font-black text-xl tracking-widest bg-primary text-primary-content"
      >
        {{ letter }}
      </div>
    </div>

    <!-- グリッド本体 (5×5、中央=12番目はFREE) -->
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
          :key="seatAt(i) ? seatAt(i)!.lastVisit : i"
          :seat="seatAt(i)"
          :index="slotIndex(i)"
          :statKey="statKey"
        />
      </template>
    </div>

    <!-- フッター装飾 -->
    <div class="flex gap-1 text-xs text-base-content/40 font-mono tracking-widest">★ BINGO ★</div>
  </div>
</template>

<script setup lang="ts">
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from './SeatCell.vue'

  const props = defineProps<{
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
  }>()

  // スロット番号 1〜25 のうち、中央(13)を除いた 24 枠に座席を順番に割り当てる
  // i: 1〜25 の表示上の位置
  // 中央マス(i=13)は FREE なので seats にはアクセスしない
  const slotIndex = (i: number) => (i < 13 ? i - 1 : i - 2) // 0-indexed
  const seatAt = (i: number): UserStatsRecord | null => props.seats[slotIndex(i)] ?? null
</script>
