<!-- src/ConfigMaker/components/UiEditor/FlightSeat/FlightSeatPreview.vue -->
<template>
  <HudPreview>
    <div class="bg-base-100 transparent-bg overflow-hidden" :class="[fontFamily]" :data-theme="flightSeat.color">
      <div class="origin-top" :style="{ transform: `scale(${scale})` }">
        <SeatGrid
          :isPreview="true"
          :seats="seats"
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
      <button class="btn btn-xs btn-warning" @click="resetSeats">🔄 リセット</button>
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsFlightSchema, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SeatGrid from '@main/ui/FlightSeat/parts/SeatGrid.vue'
  import { calculateTotalSeats } from '@/MainGenerator/ui/FlightSeat/composables/seatLayoutUtils'
  import { layoutStringToArray } from './CustomLayoutPresets'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'
  import { useSeatManager } from '@/MainGenerator/ui/FlightSeat/composables/useSeatManager'
  import { UserNameSchema } from '@shared/types'

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

    let effectiveRows = 1

    if (layout === 'square') {
      effectiveRows = flightSeat.value.rows
    } else if (layout === 'custom') {
      effectiveRows = parsedCustomLayout.value?.length ?? 1
    } else if (layout === 'circle') {
      effectiveRows = 1
    }

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

  // ダミーユーザーをプレビュー用のキャッシュとして保持する
  const dummyUserCache = new Map<string, ReturnType<typeof generateDummyUserStats>[0]>()

  // プレビュー用リゾルバー: キャッシュになければダミーを生成して返す
  function resolveDummyUser(userId: string) {
    if (!dummyUserCache.has(userId)) {
      const dummy = generateDummyUserStats(1)[0]
      // userIdを上書きして一貫性を保つ
      dummyUserCache.set(userId, { ...dummy, userId })
    }
    return dummyUserCache.get(userId)
  }

  const { seats, registerUser, resetSeats: resetSeatManager } = useSeatManager(totalSeats, resolveDummyUser)

  let previewUserCounter = 0

  function addPreviewUser() {
    previewUserCounter++
    const userId = `preview-user-${previewUserCounter}`
    registerUser(UserNameSchema.parse({ userId, userName: `ユーザー${previewUserCounter}` }))
  }

  function resetSeats() {
    dummyUserCache.clear()
    previewUserCounter = 0
    resetSeatManager()
  }
</script>
