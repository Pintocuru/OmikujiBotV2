<!-- src/MainGenerator/components/CounterPreview/variants/RankStandard.vue -->
<template>
  <!-- スコア表示（バブル） -->
  <div class="flex justify-center">
    <GameRankingScore
      v-if="scoreMessages.length > 0"
      :key="scoreMessages.length"
      :bot-messages="scoreMessages"
      :settings="settings"
      class="-mb-4"
    />
  </div>

  <!-- ランキングリスト -->
  <GameRankingList :bot-messages="listMessages" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
  import { SettingsRankingType } from '@/types/OmikujiData/ComponentsSchema'
  import GameRankingScore from './RankStandard/GameRankingScore.vue'
  import GameRankingList from './RankStandard/GameRankingList.vue'

  const props = defineProps<{
    botMessages: BotMessageType[]
    settings: SettingsRankingType
  }>()

  // スコア表示用（最新のメッセージのみ）
  const scoreMessages = computed(() => {
    const keys = props.settings?.targetScriptKeys
    if (!props.botMessages || !keys) return []

    return props.botMessages.filter((msg) => {
      const r = msg.ranking
      return r && typeof r.scoreValue === 'number' && keys.includes(r.scriptKey)
    })
  })

  // リスト表示用（ユニーク処理を含む）
  const listMessages = computed(() => {
    if (!props.botMessages || !props.settings?.targetScriptKeys) return []

    const targets = props.botMessages.filter((msg) => {
      const r = msg.ranking
      return r && props.settings.targetScriptKeys.includes(r.scriptKey)
    })

    // ranking.isUniqueUser が true のものが存在するか確認
    const isUniqueUser = targets.some((msg) => msg.ranking?.isUniqueUser === true)

    if (!isUniqueUser) return targets

    // ユーザーごとに最新のメッセージのみを保持
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
