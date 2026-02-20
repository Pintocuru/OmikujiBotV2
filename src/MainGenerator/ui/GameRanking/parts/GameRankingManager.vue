<!-- src\common\ui\GameRanking\GameRankingManager.vue -->
<template>
  <component :is="currentComponent" :botMessageExtra="targetRankingMessages" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { FlashComponent, SettingsRankingType } from '@/types/'
  import { BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'

  // 各コンポーネントのインポート
  import RankStandard from './variants/RankStandard.vue'

  const props = defineProps<{
    botMessageExtras: BotMessageExtraType[]
    settings: SettingsRankingType
  }>()

  const targetRankingMessages = computed<BotMessageExtraType[]>(() => {
    const keys = props.settings.targetScriptKeys
    if (!keys?.length) return []
    return props.botMessageExtras.filter((m) => keys.includes(m.componentKey))
  })

  // コンポーネントマッピング
  const componentMap: Record<FlashComponent, any> = {
    rankStandard: RankStandard,
  }

  // 現在のコンポーネントを取得
  const currentComponent = computed(() => {
    const component = props.settings.component || 'rankStandard'
    return componentMap[component] || RankStandard
  })
</script>
