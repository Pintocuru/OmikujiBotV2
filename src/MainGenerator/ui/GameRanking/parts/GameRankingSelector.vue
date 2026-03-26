<!-- src/MainGenerator/ui/GameRanking/parts/GameRankingSelector.vue -->
<template>
  <component :is="currentComponent" :botMessageExtra="botMessageExtras" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RankingComponent, GameRankingType } from '@/types/'
  import { BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'

  // 各コンポーネントのインポート
  import rankStandard from '../layouts/RankStandard.vue'

  const props = defineProps<{
    botMessageExtras: BotMessageExtraType[]
    settings: GameRankingType
  }>()

  // コンポーネントマッピング
  const componentMap: Record<RankingComponent, any> = {
    rankStandard,
  }

  // 現在のコンポーネントを取得
  const currentComponent = computed(() => {
    const component = props.settings.component || 'rankStandard'
    return componentMap[component] || rankStandard
  })
</script>
