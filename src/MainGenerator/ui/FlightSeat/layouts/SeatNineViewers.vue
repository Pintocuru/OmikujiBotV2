<!-- src/MainGenerator/ui/FlightSeat/layouts/SeatNineViewers.vue -->
<template>
  <div class="flex flex-col items-center gap-3">
    <div
      v-for="(row, rowIndex) in layout"
      :key="rowIndex"
      class="grid gap-3 justify-center"
      :style="{
        gridTemplateColumns: `repeat(${row}, 5rem)`,
      }"
    >
      <SeatCell
        v-for="colIndex in row"
        :key="displaySeats[getIndex(rowIndex, colIndex - 1)]?.lastVisit ?? getIndex(rowIndex, colIndex - 1)"
        :seat="displaySeats[getIndex(rowIndex, colIndex - 1)]"
        :index="getIndex(rowIndex, colIndex - 1)"
        :statKey="statKey"
        :colorFrom="checkerColor(getIndex(rowIndex, colIndex - 1))"
      />
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

  // 例: [3,3,3] / [1,3,5] / [4,5]
  const layout = computed(() => props.customLayout ?? [3, 3, 3])

  // 総セル数
  const total = computed(() => layout.value.reduce((sum, n) => sum + n, 0))

  // フラット配列化
  const displaySeats = computed(() => Array.from({ length: total.value }, (_, i) => props.seats[i] ?? null))

  // 行列 → インデックス変換
  const getIndex = (row: number, col: number) => layout.value.slice(0, row).reduce((sum, n) => sum + n, 0) + col

  const checkerColor = (i: number): DaisyUIColorType =>
    i % 2 === 0 ? (props.color.backFrom ?? 'info') : (props.color.backTo ?? 'warning')
</script>
