<!-- src/MainGenerator/App.vue -->
<template>
  <div v-if="appStore.isInitialized" class="h-screen overflow-hidden" :class="[fontClass]" data-theme="transparent">
    <!-- コメントフキダシ表示 -->
    <CommentBubble v-if="components.conditions.includes('bubble')" />

    <!-- 右下UI要素コンテナ -->
    <ToastWidgets v-if="components.conditions.includes('toast')" />

    <!-- ランキングリスト -->
    <GameRankingViewer v-if="components.conditions.includes('ranking')" />

    <!-- ランキングリスト -->
    <CounterPreview v-if="components.conditions.includes('counter')" />
  </div>

  <!-- わんコメが起動されていない場合のエラー表示 -->
  <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useFontFamily } from '@/types/BotComponents/useFontFamily'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { useRuleProcessor } from './scripts/RuleProcess/RuleProcessor'
  import ErrorInitComponent from '@shared/components/error/ErrorInfo.vue'

  import CommentBubble from '@MainComponents/CommentBubble/CommentBubble.vue'
  import ToastWidgets from '@/MainGenerator/components/ToastWidgets/ToastWidgets.vue'
  import GameRankingViewer from '@/MainGenerator/components/GameRankingViewer/GameRankingViewer.vue'
  import CounterPreview from '@/MainGenerator/components/CounterPreview/CounterPreview.vue'

  import { storeToRefs } from 'pinia'

  // Pinia Store
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const components = computed(() => data.value.displaySettings.components)

  // comment/timerルール稼働
  const { initializeApp, processComments, startTimers } = useRuleProcessor()

  // フォントの指定
  const fontClass = computed(() => useFontFamily(appStore.data.displaySettings.global.fontFamily ?? 'default'))

  // 初期化処理
  onMounted(async () => {
    const isInit = await initializeApp(appStore.userConfig, (comments) => {
      // コメント処理
      const botMessages = processComments(comments)
      appStore.scheduleBotMessages(botMessages)
    })
    appStore.setInitialized(isInit)

    // タイマー開始
    if (isInit) {
      startTimers((messages) => {
        appStore.scheduleBotMessages(messages)
      })
    }
  })
</script>
