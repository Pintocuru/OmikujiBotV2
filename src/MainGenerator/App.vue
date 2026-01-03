<!-- src/MainGenerator/App.vue -->
<template>
  <div v-if="appStore.isInitialized" class="h-screen overflow-hidden" :class="[fontClass]" data-theme="transparent">
    <!-- コメントフキダシ表示 -->
    <CommentBubble v-if="conditions.includes('bubble')" class="z-10 pointer-events-none" />

    <!-- 右下UI要素コンテナ -->
    <ToastWidgets v-if="conditions.includes('toast')" class="z-10" />

    <!-- ランキングリスト -->
    <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
      <GameRankingViewer v-if="conditions.includes('ranking')" />

      <!-- カウンター -->
      <CounterPreview v-if="conditions.includes('counter')" />
    </div>
  </div>

  <!-- わんコメが起動されていない場合のエラー表示 -->
  <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useFontFamily } from '@/types/MainGenerator/useFontFamily'
  import CommentBubble from '@main/ui/CommentBubble/CommentBubble.vue'
  import ToastWidgets from '@main/ui/ToastWidgets/ToastWidgets.vue'
  import GameRankingViewer from '@main/ui/GameRanking/GameRanking.vue'
  import CounterPreview from '@main/ui/CounterPreview/CounterPreview.vue'
  import { RuleCommentProcessor } from '@main/scripts/RuleProcess/RuleCommentProcessor'
  import { useRuleProcessor } from '@main/scripts/RuleProcess/RuleProcessor'
  import { useAppStore } from '@main/stores/useAppStore'
  import ErrorInitComponent from '@shared/components/error/ErrorInfo.vue'

  // Pinia Store
  const appStore = useAppStore()
  const conditions = computed(() => appStore.data.components.conditions)

  // フォントの指定
  const fontClass = computed(() => useFontFamily(appStore.data.components.bubble.fontFamily ?? 'default'))

  const ruleCommentProcessor = new RuleCommentProcessor()

  // comment/timerルール稼働
  const { initializeApp, startTimers } = useRuleProcessor()

  // 初期化処理
  onMounted(async () => {
    const isInit = await initializeApp((omikens) => {
      // コメント処理
      const botMessages = ruleCommentProcessor.respondToComments(omikens)
      appStore.scheduleBotMessages(botMessages)
    })
    appStore.setInitialized(isInit)

    // タイマー開始
    if (isInit) {
      startTimers((messages) => appStore.scheduleBotMessages(messages))
    }
  })
</script>
