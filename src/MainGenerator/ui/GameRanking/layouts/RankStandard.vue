<!-- src/MainGenerator/ui/GameRanking/layouts/RankStandard.vue -->
<template>
  <!-- スコア表示（バブル） -->
  <div class="flex justify-center">
    <GameRankingScore
      v-if="scoreMessages.length > 0"
      :key="scoreMessages.length"
      :scoreMessages="scoreMessages"
      :settings="settings"
      class="-mb-4"
    />
  </div>

  <!-- ランキングリスト -->
  <GameRankingList :listMessages="listMessages" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { GameRankingType } from '@/types/OmikujiData/'
  import { BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'
  import GameRankingScore from './RankStandard/GameRankingScore.vue'
  import GameRankingList from './RankStandard/GameRankingList.vue'

  const props = defineProps<{
    botMessageExtra: BotMessageExtraType[]
    settings: GameRankingType
  }>()

  // スコア表示用（scoreValue を持つもの）
  const scoreMessages = computed(() => props.botMessageExtra.filter((m) => typeof m.lists?.order === 'number'))

  // リスト表示用
  const listMessages = computed(() => {
    const messages = props.botMessageExtra
    if (!messages.length) return []

    const needsUnique = messages.some((m) => m.lists?.isUnique === true)

    return needsUnique ? uniqueByLatestUser(messages) : messages
  })

  // ユーザーごとに最新メッセージを残す
  function uniqueByLatestUser(messages: BotMessageExtraType[]): BotMessageExtraType[] {
    const map = new Map<string, BotMessageExtraType>()

    for (const msg of messages) {
      const userId = msg.user?.userId
      if (!userId) continue

      const prev = map.get(userId)
      if (!prev) {
        map.set(userId, msg)
        continue
      }

      const prevTs = prev.user?.timestamp ?? 0
      const currTs = msg.user?.timestamp ?? 0

      if (currTs > prevTs) map.set(userId, msg)
    }

    return [...map.values()]
  }
</script>
