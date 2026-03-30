<!-- src/ConfigMaker/UiEditor/SocialRoster/SocialRosterPreview.vue -->
<template>
  <HudPreview>
    <div class="bg-base-100 transparent-bg overflow-hidden" :class="[fontFamily]" :data-theme="socialRoster.color">
      <SocialRosterSelector :settings="socialRoster" :users="sortedPreviewUsers" :streamScore="streamScore" />
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
  import { SocialRosterSchema, UserStatsRecord, useFontFamily } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SocialRosterSelector from '@main/ui/SocialRoster/parts/SocialRosterSelector.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'
  import { calcStreamScore, sortUsers } from '@/MainGenerator/ui/SocialRoster/composables/socialRosterLogic'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))
  const socialRoster = computed(() => data.value.components.settings.socialRoster ?? SocialRosterSchema.parse({}))

  const previewUsers = ref<UserStatsRecord[]>(generateDummyUserStats(8))

  const streamScore = computed(() => calcStreamScore(previewUsers.value))

  const sortedPreviewUsers = computed(() => sortUsers(previewUsers.value, socialRoster.value.sortKey))

  function addPreviewUser() {
    previewUsers.value.unshift(generateDummyUserStats(1)[0])
  }

  function resetPreviewUsers() {
    previewUsers.value = generateDummyUserStats(8)
  }
</script>
