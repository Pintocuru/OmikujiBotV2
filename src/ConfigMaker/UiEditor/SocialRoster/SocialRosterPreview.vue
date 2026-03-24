<!-- src/ConfigMaker/components/UiEditor/SocialRoster/SocialRosterPreview.vue -->
<template>
  <HudPreview>
    <div class="bg-base-100 transparent-bg overflow-hidden" :class="[fontFamily]" :data-theme="socialRoster.color">
      <div class="grid w-full" :style="{ gridTemplateColumns: `repeat(auto-fill, ${cellPx}px)` }">
        <SeatCell
          v-for="(user, i) in previewUsers"
          :key="user.userId"
          :seat="user"
          :index="i"
          :statKey="socialRoster.statKey"
          :size="cellPx"
        />
      </div>
    </div>
    <template #hud>
      <div class="space-x-2">
        <div class="badge badge-sm badge-primary">表示中: {{ previewUsers.length }}人</div>
        <button class="btn btn-xs btn-primary" @click="addPreviewUser">👤 追加</button>
        <button class="btn btn-xs btn-warning" @click="resetPreviewUsers">🔄 リセット</button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsSocialSchema, UserStatsRecord, useFontFamily } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SeatCell from '@main/ui/FlightSeat/layouts/SeatCell.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))
  const socialRoster = computed(() => data.value.components.settings.socialRoster ?? SettingsSocialSchema.parse({}))

  const cellSizePxMap: Record<string, number> = {
    'h-8': 32,
    'h-10': 40,
    'h-12': 48,
    'h-16': 64,
    'h-20': 80,
    'h-24': 96,
  }
  const cellPx = computed(() => cellSizePxMap[socialRoster.value.cellSize] ?? 64)

  const previewUsers = ref<UserStatsRecord[]>(generateDummyUserStats(8))

  function addPreviewUser() {
    previewUsers.value.push(generateDummyUserStats(1)[0])
  }

  function resetPreviewUsers() {
    previewUsers.value = generateDummyUserStats(8)
  }
</script>
