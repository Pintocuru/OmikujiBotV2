<!-- src/MainGenerator/ui/GameRanking/parts/GameRankingSelector.vue -->
<template>
  <component :is="currentComponent" :botMessageExtra="botMessageExtras" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RankingComponent, GameRankingType } from '@/types'
  import { BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'
  import rankStandard from '../layouts/RankStandard.vue'
  import standard from '../layouts/Standard.vue'

  const props = defineProps<{
    botMessageExtras: BotMessageExtraType[]
    settings: GameRankingType
  }>()

  const componentMap: Record<RankingComponent, any> = {
    rankStandard,
    standard,
  }

  const currentComponent = computed(() => {
    const component = props.settings.component || 'rankStandard'
    return componentMap[component] || rankStandard
  })
</script>
