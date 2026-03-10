<!-- src/ConfigMaker/components/UiEditor/FlightSeat/FlightSeatPreview.vue -->
<template>
  <HudPreview>
    <div class="bg-base-100 transparent-bg overflow-hidden" :class="[fontFamily]" :data-theme="flightSeat.color">
      <div class="origin-top" :style="{ transform: `scale(0.5)` }">
        <SeatSelector
          :color="flightSeat.color"
          :label="flightSeat.label"
          :seats="seats"
          :kind="flightSeat.component"
          :customLayout="parsedCustomLayout"
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
  import { calculateTotalSeats, parseCustomLayout } from '@/MainGenerator/ui/FlightSeat/composables/seatLayoutUtils'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'
  import { useSeatManager } from '@/MainGenerator/ui/FlightSeat/composables/useSeatManager'
  import { UserNameSchema } from '@shared/types'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))
  const flightSeat = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSchema.parse({}))

  // 現在選択中のkindに対応するdefault値
  const defaultValue = computed(() => flightComponentDefaults[flightSeat.value.component])

  // customLayoutはstringのdefaultを持つkindのときのみ意味を持つ
  const parsedCustomLayout = computed(() => parseCustomLayout(defaultValue.value, flightSeat.value.customLayout))

  // totalSeats: defaultValueがnumberならそのまま、stringならパースして合計
  const totalSeats = computed(() => calculateTotalSeats(defaultValue.value, flightSeat.value.customLayout))

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
