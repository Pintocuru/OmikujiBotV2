<!-- src/ConfigMaker/components/UiEditor/FlightSeat/FlightSeatPreview.vue -->
<template>
  <HudPreview>
    <div class="bg-base-100 transparent-bg overflow-hidden" :class="[fontFamily]" :data-theme="flightSeat.color">
      <div class="origin-top" :style="{ transform: `scale(${scale})` }">
        <SeatGrid
          :isPreview="true"
          :seats="previewSeats"
          :layout="flightSeat.layout"
          :rows="flightSeat.rows"
          :cols="flightSeat.cols"
          :customLayout="parsedCustomLayout"
          :circleSeats="flightSeat.circleSeats"
          :statKey="flightSeat.statKey"
        />
      </div>
    </div>
    <div class="absolute bottom-1 right-1 space-x-1">
      <div class="badge badge-sm badge-primary">現在の座席: {{ totalSeats }}</div>
      <button class="btn btn-xs btn-primary" @click="addPreviewUser">👤 乗車</button>
      <button class="btn btn-xs btn-warning" @click="resetPreviewSeats">🔄 リセット</button>
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsFlightSchema, useFontFamily, UserStatsRecord } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SeatGrid from '@main/ui/FlightSeat/parts/SeatGrid.vue'
  import { calculateTotalSeats } from '@/MainGenerator/ui/FlightSeat/composables/seatLayoutUtils'
  import { layoutStringToArray } from './CustomLayoutPresets'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  const flightSeat = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSchema.parse({}))

  const parsedCustomLayout = computed(() => {
    if (flightSeat.value.layout !== 'custom') return undefined
    return layoutStringToArray(flightSeat.value.customLayout ?? '[1,2,3,4,5]')
  })

  const scale = computed(() => {
    const layout = flightSeat.value.layout

    // 実際の行数を求める
    let effectiveRows = 1

    if (layout === 'square') {
      effectiveRows = flightSeat.value.rows
    } else if (layout === 'custom') {
      effectiveRows = parsedCustomLayout.value?.length ?? 1
    } else if (layout === 'circle') {
      // circle は 1 行扱い（円形なので）
      effectiveRows = 1
    }

    // 行数に応じて scale を決定
    if (effectiveRows <= 3) return 0.8
    if (effectiveRows <= 4) return 0.6
    if (effectiveRows <= 5) return 0.5
    if (effectiveRows <= 7) return 0.4
    if (effectiveRows <= 9) return 0.3
    return 0.2
  })

  const totalSeats = computed(() => {
    const { layout, rows, cols, circleSeats } = flightSeat.value
    return calculateTotalSeats(layout, rows, cols, parsedCustomLayout.value, circleSeats)
  })

  const previewSeats = ref<(UserStatsRecord | null)[]>([])
  const previewUserCounter = ref(0)

  function resetPreviewSeats() {
    previewSeats.value = Array(totalSeats.value).fill(null)
    previewUserCounter.value = 0
  }

  function addPreviewUser() {
    const emptyIndexes = previewSeats.value.map((s, i) => (s === null ? i : -1)).filter((i) => i !== -1)

    if (emptyIndexes.length === 0) {
      const occupiedIndexes = previewSeats.value.map((s, i) => (s !== null ? i : -1)).filter((i) => i !== -1)
      const targetIndex = occupiedIndexes[Math.floor(Math.random() * occupiedIndexes.length)]
      previewSeats.value[targetIndex] = makePreviewUser()
      return
    }

    const targetIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
    previewSeats.value[targetIndex] = makePreviewUser()
  }

  function makePreviewUser(): UserStatsRecord {
    previewUserCounter.value++
    return generateDummyUserStats(1)[0]
  }

  watch(
    totalSeats,
    () => {
      resetPreviewSeats()
    },
    { immediate: true }
  )
</script>
