<!-- templates\OmikujiBot\src\MainGenerator\packages\GameRanking\GameRanking.vue -->
<template>
  <div>
    <!-- Scriptsゲーム表示 -->
    <GameRankingViewer v-if="displayStore.currentScriptKey !== null" :key="displayStore.currentComponentKey" />

    <!-- 右下UI要素コンテナ -->
    <ToastWidgets />
  </div>
</template>

<script setup lang="ts">
  import { useDisplayStore } from '@/MainGenerator/stores/'
  import GameRankingViewer from '@MainComponents/GameRankingViewer/GameRankingViewer.vue'
  import ToastWidgets from '@/MainGenerator/components/ToastWidgets/ToastWidgets.vue'

  const displayStore = useDisplayStore()
</script>
