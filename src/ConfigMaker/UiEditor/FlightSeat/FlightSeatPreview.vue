<!-- src/ConfigMaker/UiEditor/FlightSeat/FlightSeatPreview.vue -->
<template>
  <HudPreview>
    <div class="bg-base-100 transparent-bg overflow-hidden" :class="[fontFamily]" :data-theme="flightSeat.color">
      <SeatSelector
        :color="flightSeat.color"
        :seats="seats"
        :kind="flightSeat.component"
        :customLayout="parsedCustomLayout"
        :statKey="flightSeat.statKey"
        :totalSeats="totalSeats"
      />
    </div>
    <!-- 右下に表示するHUD（スケーリングされない） -->
    <template #hud>
      <div class="space-x-2">
        <div class="badge badge-sm badge-primary">現在の座席: {{ totalSeats }}</div>
        <button class="btn btn-xs btn-primary" @click="addPreviewUser">👤 乗車</button>
        <button class="btn btn-xs btn-warning" @click="resetSeats">🔄 リセット</button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { FlightSeatSchema, flightComponentDefaults, useFontFamily } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SeatSelector from '@main/ui/FlightSeat/parts/FlightSeatSelector.vue'
  import { calculateTotalSeats, parseCustomLayout } from '@main/ui/FlightSeat/composables/seatLayoutUtils'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'
  import { useSeatManager } from '@main/ui/FlightSeat/composables/useSeatManager'
  import { UserNameSchema } from '@shared/types'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))
  const flightSeat = computed(() => data.value.components.settings.flightSeat ?? FlightSeatSchema.parse({}))

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
