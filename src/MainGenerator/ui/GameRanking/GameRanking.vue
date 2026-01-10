<!-- src\MainGenerator\ui\GameRanking\GameRanking.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
    <!-- スコア表示 -->
    <div class="flex justify-center">
      <!-- DEV preview trigger -->
      <div
        v-if="isDev"
        class="fixed top-4 right-4 z-50 px-3 py-1 text-xs rounded-md bg-base-200 opacity-40 hover:opacity-100 cursor-pointer"
        @mouseenter="devHoverActive = true"
        @mouseleave="devHoverActive = false"
      >
        Bubble Preview
      </div>

      <GameRankingScore
        v-if="rankingScoreMessages.length > 0"
        :key="rankingScoreMessages.length"
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
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageSchema, isDev } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import GameRankingScore from '@/common/ui/GameRanking/GameRankingScore.vue'
  import GameRankingList from '@/common/ui/GameRanking/GameRankingList.vue'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const devHoverActive = ref(false)
  const devScoreMessages = computed(() => {
    if (!isDev || !devHoverActive.value) return []
    return [
      BotMessageSchema.parse({
        type: 'rankingOnly',
        ranking: {
          listName: 'test',
          scoreText: 'test',
          scoreValue: 100,
          scriptKey: rankingSettings.value.targetScriptKeys[0],
        },
      }),
    ]
  })

  // ランキング設定を取得
  const rankingSettings = computed(() => data.value.components.ranking)

  // ランキング対象のメッセージをフィルタリング
  const rankingScoreMessages = computed(() => {
    const keys = rankingSettings.value?.targetScriptKeys
    const messages = botMessages.value

    const base =
      !messages || !keys
        ? []
        : messages.filter((msg) => {
            const r = msg.ranking
            return r && typeof r.scoreValue === 'number' && keys.includes(r.scriptKey)
          })

    return isDev ? [...base, ...devScoreMessages.value] : base
  })

  const rankingListMessages = computed(() => {
    if (!botMessages.value || !rankingSettings.value?.targetScriptKeys) return []

    const targets = botMessages.value.filter((msg) => {
      const r = msg.ranking
      return r && rankingSettings.value.targetScriptKeys.includes(r.scriptKey)
    })

    // ranking.isUniqueUser が true のものが存在するか
    const isUniqueUser = targets.some((msg) => msg.ranking?.isUniqueUser === true)

    if (!isUniqueUser) return targets

    const map = new Map<string, (typeof targets)[number]>()

    for (const msg of targets) {
      const user = msg.user
      if (!user?.userId) continue

      const prev = map.get(user.userId)
      if (!prev) {
        map.set(user.userId, msg)
        continue
      }

      const prevTs = prev.user?.timestamp ?? 0
      const currTs = user.timestamp ?? 0

      if (currTs > prevTs) map.set(user.userId, msg)
    }

    return Array.from(map.values())
  })
</script>
