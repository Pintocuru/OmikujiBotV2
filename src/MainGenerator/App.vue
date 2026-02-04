<!-- src/MainGenerator/App.vue -->
<template>
  <div v-if="appStore.isInitialized" class="h-screen overflow-hidden" :class="[fontClass]" data-theme="transparent">
    <!-- コメントフキダシ表示 -->
    <CommentBubble v-if="conditions.includes('bubble')" class="z-10 pointer-events-none" />

    <!-- 右下UI要素コンテナ -->
    <ToastWidgets v-if="conditions.includes('toast')" class="z-10" />

    <!-- ランキングリスト -->
    <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
      <GameRankingViewer v-if="conditions.includes('ranking')" />
    </div>

    <!-- カウンター -->
    <CounterPreview v-if="conditions.includes('counter') && isComment" />

    <!-- カウンター -->
    <MetaDebugPanel v-if="isDev" />
  </div>

  <!-- わんコメが起動されていない場合のエラー表示 -->
  <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import MetaDebugPanel from '@main/ui/MetaDebugPanel.vue'
  import { useFontFamily } from '@/types/MainGenerator/useFontFamily'
  import CommentBubble from '@main/ui/CommentBubble/CommentBubble.vue'
  import ToastWidgets from '@main/ui/ToastWidgets/ToastWidgets.vue'
  import GameRankingViewer from '@main/ui/GameRanking/GameRanking.vue'
  import CounterPreview from '@main/ui/CounterPreview/CounterPreview.vue'
  import { RuleCommentProcessor } from '@main/scripts/RuleProcess/RuleCommentProcessor'
  import { useRuleProcessor } from '@main/scripts/RuleProcess/RuleProcessor'
  import { useAppStore } from '@main/stores/useAppStore'
  import ErrorInitComponent from '@shared/components/error/ErrorInfo.vue'
  import { generatorApi } from '@config/dev/services/generatorApi'
  import { useVisibilityAccess } from './scripts/FeatureAccess/useAccessCheckerMain'
  import { isDev } from '@/types'

  // Pinia Store
  const appStore = useAppStore()
  const conditions = computed(() => appStore.data.components.conditions)
  const { isComment, isTimer } = useVisibilityAccess()

  // フォントの指定
  const fontClass = computed(() => useFontFamily(appStore.data.components.bubble.fontFamily ?? 'default'))

  const ruleCommentProcessor = new RuleCommentProcessor()

  // comment/timerルール稼働
  const { initializeApp, startTimers, stopTimers, startMetaRules } = useRuleProcessor()

  // 初期化処理
  onMounted(async () => {
    const isInit = await initializeApp((omikens) => {
      // usageチェック
      if (!isComment.value) return

      // コメント処理
      const botMessages = ruleCommentProcessor.respondToComments(omikens)
      appStore.scheduleBotMessages(botMessages)
    })
    appStore.setInitialized(isInit)

    if (isInit) {
      // プラグインのデフォルト設定を読み込む
      const isHealth = await generatorApi.getHealth()
      if (isHealth) {
        const lowData = await generatorApi.loadGeneratorConfig()
        if (lowData) appStore.loadData(lowData)
      }

      // タイマー開始
      if (isTimer.value) {
        startTimers((messages) => appStore.scheduleBotMessages(messages))
      }

      // メタルール開始
      startMetaRules((messages) => appStore.scheduleBotMessages(messages))
    }
  })

  // タイマー停止
  onUnmounted(() => {
    console.log('App.vue がアンマウントされました。タイマーを停止します。')
    stopTimers()
  })
</script>
