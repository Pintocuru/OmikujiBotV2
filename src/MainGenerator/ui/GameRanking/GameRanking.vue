<!-- src\MainGenerator\ui\GameRanking\GameRanking.vue -->
<template>
  <div>
    <!-- DEV preview trigger -->
    <div
      v-if="isDev"
      class="fixed top-4 right-4 z-50 px-3 py-1 text-xs rounded-md bg-base-200 opacity-40 hover:opacity-100 cursor-pointer"
      @mouseenter="devHoverActive = true"
      @mouseleave="devHoverActive = false"
    >
      Ranking Preview
    </div>

    <!-- CounterPreviewManagerで表示を管理 -->
    <CounterPreviewManager :bot-messages="filteredMessages" :settings="rankingSettings" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageSchema, isDev } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import CounterPreviewManager from '@/common/ui/GameRanking/GameRankingManager.vue'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const devHoverActive = ref(false)

  // 開発環境用のダミーメッセージ
  const devScoreMessages = computed(() => {
    if (!isDev || !devHoverActive.value) return []
    return [
      BotMessageSchema.parse({
        type: 'rankingOnly',
        ranking: {
          listName: 'テストユーザー',
          scoreText: '12,345',
          scoreValue: 12345,
          scriptKey: rankingSettings.value.targetScriptKeys[0],
        },
      }),
    ]
  })

  // ランキング設定を取得
  const rankingSettings = computed(() => data.value.components.ranking)

  // ランキング対象のメッセージをフィルタリング
  const filteredMessages = computed(() => {
    const keys = rankingSettings.value?.targetScriptKeys
    const messages = botMessages.value

    const base =
      !messages || !keys
        ? []
        : messages.filter((msg) => {
            const r = msg.ranking
            return r && rankingSettings.value.targetScriptKeys.includes(r.scriptKey)
          })

    return isDev ? [...base, ...devScoreMessages.value] : base
  })
</script>
