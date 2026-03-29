<template>
  <div class="space-y-2">
    <!-- 配信戦闘力 -->
    <div class="card bg-base-100 shadow p-3 w-fit mx-auto">
      <div class="text-xs opacity-60 mb-1 text-center">配信戦闘力</div>

      <!-- ドラムカウンター -->
      <div class="flex items-center justify-center gap-1 font-bold">
        <div
          v-for="(digit, i) in digits"
          :key="i"
          class="relative overflow-hidden rounded bg-base-300"
          :style="{ width: size + 'px', height: digitHeight + 'px' }"
        >
          <div
            class="absolute left-0 w-full transition-transform duration-500 ease-out"
            :style="{
              transform: `translateY(-${digit * digitHeight}px)`,
            }"
          >
            <div
              v-for="n in 10"
              :key="n"
              class="flex items-center justify-center"
              :style="{ height: digitHeight + 'px' }"
            >
              {{ n - 1 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 既存：SeatCellグリッド（そのまま保持） -->
    <div class="grid w-full" :style="{ gridTemplateColumns: `repeat(auto-fill, ${cellPx}px)` }">
      <div v-for="user in users" :key="user.userId" class="card bg-base-200 shadow-sm p-1">
        <SeatCell :seat="user" :index="0" :statKey="statKey" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import SeatCell from '@main/ui/FlightSeat/layouts/SeatCell.vue'

  const props = defineProps<{
    users: UserStatsRecord[]
    statKey: StatKeyNum | null
    color: DaisyUiThemeFieldsType
    streamScore: number
  }>()

  const cellPx = computed(() => 64)

  // カウンター用
  const size = 28
  const digitHeight = size * 1.4

  const digits = computed(() => {
    const str = Math.floor(props.streamScore).toString()
    const len = Math.max(6, str.length)
    return str.padStart(len, '0').split('').map(Number)
  })
</script>
