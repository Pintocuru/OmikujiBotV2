<!-- SeatGridStaggered.vue -->
<template>
  <div class="flex flex-col gap-3 items-center">
    <div
      v-for="row in rows"
      :key="row"
      class="grid gap-3"
      :style="{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        marginLeft: row % 2 === 0 ? '2.5rem' : '0', // 偶数行をずらす
      }"
    >
      <SeatCell
        v-for="col in cols"
        :key="col"
        :seat="displaySeats[(row - 1) * cols + col - 1]"
        :index="(row - 1) * cols + col - 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import SeatCell from './SeatCell.vue'

  const props = defineProps<{
    seats: (UserVisitRecord | null)[]
    rows: number
    cols: number
  }>()

  const displaySeats = computed(() => Array.from({ length: props.rows * props.cols }, (_, i) => props.seats[i] ?? null))
</script>
