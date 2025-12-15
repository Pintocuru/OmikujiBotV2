<!-- src/MainGenerator/components/GameRankingViewer/GameRankingViewer.vue -->
<template>
  <div v-if="displayStore.currentComponentConfig">
    <!-- Score Display with Animation -->
    <GameRankingScore
      v-if="scoreVisibility.isVisible.value && displayStore.currentUserRankings.length > 0"
      :player-data="displayStore.currentUserRankings[0]"
      :theme="displayStore.currentComponentConfig"
      :score-display="displayStore.currentComponentConfig.scoreDisplay"
    />

    <!-- Ranking list -->
    <GameRankingList />
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
  import GameRankingScore from './GameRankingScore.vue'
  import GameRankingList from './GameRankingList.vue'
  import { useDelayedDisplay } from './composables/useDelayedDisplay'

  // Score display control
  const scoreVisibility = useDelayedDisplay(currentUserRankings, {
    delayMs: 4500,
    displayMs: 5000,
  })
</script>
