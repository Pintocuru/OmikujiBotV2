<!-- src\common\ui\GameRanking\GameRankingManager.vue -->
<template>
  <component :is="currentComponent" :bot-messages="botMessages" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RankingComponent, SettingsRankingType } from '@/types/'
  import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'

  // 各コンポーネントのインポート
  import RankStandard from './variants/RankStandard.vue'

  const props = defineProps<{
    botMessages: BotMessageType[]
    settings: SettingsRankingType
  }>()

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
