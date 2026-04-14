<!-- src/MainGenerator/ui/GameRanking/layouts/Standard.vue -->
<template>
  <GameRankingList :listMessages="listMessages" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { GameRankingType } from '@/types/OmikujiData/'
  import { BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'
  import GameRankingList from './RankStandard/GameRankingList.vue'

  const props = defineProps<{
    botMessageExtra: BotMessageExtraType[]
    settings: GameRankingType
  }>()

  const listMessages = computed(() => {
    const messages = props.botMessageExtra
    if (!messages.length) return []

    const needsUnique = messages.some((m) => m.lists?.isUnique === true)
    return needsUnique ? uniqueByLatestUser(messages) : messages
  })

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
