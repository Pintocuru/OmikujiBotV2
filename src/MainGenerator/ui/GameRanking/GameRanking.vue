<!-- src\MainGenerator\ui\GameRanking\GameRanking.vue -->
<template>
  <!-- DEV preview trigger -->
  <div
    v-if="isDev && showDevLabel"
    class="fixed top-4 right-4 z-50 px-3 py-1 text-xs rounded-md bg-base-200 opacity-40 hover:opacity-100 cursor-pointer"
    @mouseenter="devHoverActive = true"
    @mouseleave="devHoverActive = false"
  >
    Ranking Preview
  </div>

  <!-- CounterPreviewManagerで表示を管理 -->
  <CounterPreviewManager :botMessageExtras="rankingMessages" :settings="rankingSettings" />
</template>

<script setup lang="ts">
  import { computed, ComputedRef, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageExtraSchema, BotMessageExtraType, isDev, SettingsRankingSchema } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import CounterPreviewManager from './parts/GameRankingManager.vue'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const devHoverActive = ref(false)
  const showDevLabel = ref(true)

  // 開発環境用のダミーメッセージ
  const devScoreMessages = computed<BotMessageExtraType[]>(() => {
    if (!isDev || !devHoverActive.value) return []
    return [
      BotMessageExtraSchema.parse({
        componentKey: rankingSettings.value.targetScriptKeys[0],
        lists: {
          listName: 'テストユーザー',
          text: '12,345',
          order: 12345,
        },
      }),
    ]
  })

  // ランキング設定を取得
  const rankingSettings = computed(() => data.value.components.settings.ranking ?? SettingsRankingSchema.parse({}))

  // ランキング対象のメッセージをフィルタリング
  const rankingMessages: ComputedRef<BotMessageExtraType[]> = computed(() => {
    const keys = rankingSettings.value?.targetScriptKeys
    if (!keys) return []

    const base = botMessages.value.filter((msg): msg is BotMessageExtraType => {
      if (msg.type !== 'extra' || !msg.lists) return false
      return rankingSettings.value.targetScriptKeys.includes(msg.componentKey)
    })
    return isDev ? [...base, ...devScoreMessages.value] : base
  })

  onMounted(() => {
    setTimeout(() => {
      showDevLabel.value = false
    }, 5000)
  })
</script>
