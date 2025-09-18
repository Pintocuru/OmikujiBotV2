<!-- src/MainGenerator/components/GameRankingViewer/GameRankingViewer.vue -->
<template>
  <div v-if="displayStore.currentComponentConfig">
    <!-- Score Display with Animation -->
    <GameRankingScore
      v-if="scoreVisibility.isVisible.value && displayStore.currentUserRankings.length > 0"
      :player-data="displayStore.currentUserRankings[0]"
      :theme="displayStore.currentComponentConfig"
      :size-config="sizeConfig"
      :score-display="displayStore.currentComponentConfig.scoreDisplay"
    />

    <!-- Ranking list -->
    <GameRankingList :size-config="sizeConfig" />
  </div>

  <!-- componentConfigがnullの場合はエラー表示 -->
  <div v-else class="p-4 bg-red-100 border border-red-400 rounded">
    <p class="text-red-700">設定が読み込まれていません</p>
    <p class="text-red-600 text-sm mt-1">
      componentConfig: {{ displayStore.currentComponentConfig ? 'loaded' : 'null' }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import GameRankingScore from './GameRankingScore.vue'
  import GameRankingList from './GameRankingList.vue'
  import { COMPONENT_SIZE_CONFIG } from './composables/useComponentConfig'
  import { useDelayedDisplay } from './composables/useDelayedDisplay'
  import { useDisplayStore } from '@/MainGenerator/stores'
  import { storeToRefs } from 'pinia'

  // Piniaストアの使用
  const displayStore = useDisplayStore()
  const { displaySize, currentUserRankings } = storeToRefs(displayStore)

  // Size configuration
  const sizeConfig = computed(() => COMPONENT_SIZE_CONFIG[displaySize.value])

  // Score display control
  const scoreVisibility = useDelayedDisplay(currentUserRankings, {
    delayMs: 4500,
    displayMs: 5000,
  })
</script>
