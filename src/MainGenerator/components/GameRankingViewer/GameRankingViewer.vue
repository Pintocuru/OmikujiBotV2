<!-- src/MainGenerator/components/GameRankingViewer/GameRankingViewer.vue -->
<template>
  <div v-if="rankingSettings" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-10">
    <!-- スコア表示 -->
    <div class="flex justify-center">
      <GameRankingScore
        v-if="rankingScoreMessages.length > 0"
        :bot-messages="rankingScoreMessages"
        :settings="rankingSettings"
        class="-mb-4"
      />
    </div>

    <!-- ランキングリスト -->
    <GameRankingList :bot-messages="rankingListMessages" :settings="rankingSettings" />
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
  const rankingSettings = computed(() => data.value.components.ranking)

  // ランキング対象のメッセージをフィルタリング
  const rankingScoreMessages = computed(() => {
    if (!botMessages.value || !rankingSettings.value?.scriptKey) return []

    return botMessages.value.filter((msg) => {
      const r = msg.message.ranking
      return r?.scriptKey === rankingSettings.value.scriptKey && r.scoreValue != null
    })
  })

  const rankingListMessages = computed(() => {
    if (!botMessages.value || !rankingSettings.value?.scriptKey) return []

    const targets = botMessages.value.filter((msg) => {
      return msg.message.ranking?.scriptKey === rankingSettings.value.scriptKey
    })

    // ranking.isUniqueUser が true のものが存在するか
    const isUniqueUser = targets.some((msg) => msg.message.ranking?.isUniqueUser === true)

    if (!isUniqueUser) return targets

    const map = new Map<string, (typeof targets)[number]>()

    for (const msg of targets) {
      const user = msg.message.user
      if (!user?.userId) continue

      const prev = map.get(user.userId)
      if (!prev) {
        map.set(user.userId, msg)
        continue
      }

      const prevTs = prev.message.user?.timestamp ?? 0
      const currTs = user.timestamp ?? 0

      if (currTs > prevTs) {
        map.set(user.userId, msg)
      }
    }

    return Array.from(map.values())
  })
</script>
