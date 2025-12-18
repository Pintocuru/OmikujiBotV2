<!-- src/MainGenerator/components/GameRankingViewer/GameRankingViewer.vue -->
<template>
  <div v-if="rankingSettings" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-10">
    <!-- スコア表示 -->
    <div class="flex justify-center">
      <GameRankingScore
        v-if="filteredMessages.length > 0"
        :bot-messages="filteredMessages"
        :settings="rankingSettings"
        class="-mb-4"
      />
    </div>

    <!-- ランキングリスト -->
    <GameRankingList :bot-messages="filteredMessages" :settings="rankingSettings" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import GameRankingScore from './GameRankingScore.vue'
  import GameRankingList from './GameRankingList.vue'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  // ランキング設定を取得
  const rankingSettings = computed(() => {
    return data.value?.displaySettings?.components?.ranking
  })

  // ランキング対象のメッセージをフィルタリング
  const filteredMessages = computed(() => {
    if (!botMessages.value || !rankingSettings.value?.scriptKey) {
      return []
    }

    return botMessages.value.filter((msg) => msg.comment.ranking?.scriptKey === rankingSettings.value?.scriptKey)
  })
</script>
