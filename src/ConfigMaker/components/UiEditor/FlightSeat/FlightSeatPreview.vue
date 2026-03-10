<!-- src/ConfigMaker/components/UiEditor/FlightSeat/FlightSeatPreview.vue -->
<template>
  <HudPreview>
    <div class="bg-base-100 transparent-bg overflow-hidden" :class="[fontFamily]" :data-theme="flightSeat.color">
      <div class="origin-top" :style="{ transform: `scale(${scale})` }">
        <SeatSelector
          :color="flightSeat.color"
          :label="flightSeat.label"
          :seats="seats"
          :componentConfig="flightSeat.component"
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
  import { SettingsFlightSchema, flightComponentDefaults, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SeatSelector from '@main/ui/FlightSeat/parts/SeatSelector.vue'
  import { calculateTotalSeats } from '@/MainGenerator/ui/FlightSeat/composables/seatLayoutUtils'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'
  import { useSeatManager } from '@/MainGenerator/ui/FlightSeat/composables/useSeatManager'
  import { UserNameSchema } from '@shared/types'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  const flightSeat = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSchema.parse({}))
  const component = computed(() => flightSeat.value.component)

  // kind のデフォルト値をベースに、component の値で上書き
  const resolvedConfig = computed(() => ({
    ...flightComponentDefaults[component.value.kind],
    ...component.value,
  }))

  const parsedCustomLayout = computed(() => {
    if (resolvedConfig.value.layout !== 'custom') return undefined
    try {
      return JSON.parse(resolvedConfig.value.customLayout ?? '[1,2,3,4,5]') as number[]
    } catch {
      return undefined
    }
  })

  const scale = computed(() => {
    const { layout, rows } = resolvedConfig.value
    const effectiveRows =
      layout === 'square' ? (rows ?? 1) : layout === 'custom' ? (parsedCustomLayout.value?.length ?? 1) : 1 // circle

    if (effectiveRows <= 3) return 0.8
    if (effectiveRows <= 4) return 0.6
    if (effectiveRows <= 5) return 0.5
    if (effectiveRows <= 7) return 0.4
    if (effectiveRows <= 9) return 0.3
    return 0.2
  })

  const totalSeats = computed(() => {
    const { layout, rows, cols, circleSeats } = resolvedConfig.value
    return calculateTotalSeats(layout!, rows!, cols!, parsedCustomLayout.value, circleSeats)
  })

  const dummyUserCache = new Map<string, ReturnType<typeof generateDummyUserStats>[0]>()

  function resolveDummyUser(userId: string) {
    if (!dummyUserCache.has(userId)) {
      const dummy = generateDummyUserStats(1)[0]
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
