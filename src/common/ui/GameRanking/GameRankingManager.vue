<!-- src\common\ui\GameRanking\GameRankingManager.vue -->
<template>
  <component :is="currentComponent" :rankingMessages="targetRankingMessages" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RankingComponent, SettingsRankingType } from '@/types/'
  import { BotMessageRankingType, BotMessageType } from '@/types/MainGenerator/BotMessageSchema'

  // 各コンポーネントのインポート
  import RankStandard from './variants/RankStandard.vue'

  const props = defineProps<{
    botMessages: BotMessageType[]
    settings: SettingsRankingType
  }>()

  const targetRankingMessages = computed<BotMessageRankingType[]>(() => {
    const keys = props.settings.targetScriptKeys
    if (!keys?.length) return []

    return props.botMessages.filter(
      (m): m is BotMessageRankingType => m.type === 'ranking' && keys.includes(m.ranking.scriptKey)
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
