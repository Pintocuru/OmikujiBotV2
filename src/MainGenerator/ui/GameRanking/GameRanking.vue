<!-- src/MainGenerator/ui/GameRanking/GameRanking.vue -->
<template>
  <CenteringWrapper>
    <GameRankingSelector :botMessageExtras="targetRankingMessages" :settings="rankingSettings" />
  </CenteringWrapper>
</template>

<script setup lang="ts">
  import { computed, ComputedRef } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageExtraType, GameRankingSchema } from '@/types'
  import { useAppStore } from '@main/stores/useAppStore'
  import GameRankingSelector from './parts/GameRankingSelector.vue'
  import CenteringWrapper from '@main/ui/common/CenteringWrapper.vue'

  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)

  const rankingSettings = computed(() => GameRankingSchema.parse(appStore.data.components?.settings?.ranking ?? {}))

  const rankingMessages: ComputedRef<BotMessageExtraType[]> = computed(() => {
    const keys = rankingSettings.value?.targetScriptKeys
    if (!keys) return []
    return botMessages.value.filter((msg): msg is BotMessageExtraType => {
      if (msg.type !== 'extra' || !msg.lists) return false
      return rankingSettings.value.targetScriptKeys.includes(msg.scriptKey)
    })
  })

  const targetRankingMessages = computed<BotMessageExtraType[]>(() => {
    const keys = rankingSettings.value?.targetScriptKeys
    if (!keys?.length) return []
    return rankingMessages.value.filter((m) => keys.includes(m.scriptKey))
  })
</script>
