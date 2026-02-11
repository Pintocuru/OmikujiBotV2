<!-- src\common\ui\GameRanking\GameRankingManager.vue -->
<template>
  <component :is="currentComponent" :rankingMessages="targetRankingMessages" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RankingComponent, SettingsRankingType } from '@/types/'
  import { BotMessageExtraType, BotMessageType } from '@/types/MainGenerator/BotMessageSchema'

  // 各コンポーネントのインポート
  import RankStandard from './variants/RankStandard.vue'

  const props = defineProps<{
    botMessages: BotMessageType[]
    settings: SettingsRankingType
  }>()

  const targetRankingMessages = computed<BotMessageExtraType[]>(() => {
    const keys = props.settings.targetScriptKeys
    if (!keys?.length) return []

    return props.botMessages.filter(
      (m): m is BotMessageExtraType => m.type === 'extra' && keys.includes(m.componentKey)
    )
  })

  // コンポーネントマッピング
  const componentMap: Record<RankingComponent, any> = {
    rankStandard: RankStandard,
  }

  // 現在のコンポーネントを取得
  const currentComponent = computed(() => {
    const component = props.settings.component || 'rankStandard'
    return componentMap[component] || RankStandard
  })
</script>
