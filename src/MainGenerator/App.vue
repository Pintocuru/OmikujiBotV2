<!-- src/MainGenerator/App.vue -->
<template>
  <div v-if="appStore.isInitialized" class="main-container" :class="['main-container', fontClass]">
    <!-- BOTメッセージ表示 -->
    <ViewBotMessage v-if="displayStore.currentScriptKey === null" />

    <!-- Scriptsゲーム表示 -->
    <GameRankingViewer v-else-if="displayStore.currentScriptKey !== null" :key="displayStore.currentComponentKey" />

    <!-- コントロールパネル（中央ホバーで表示:GODモードでのみ表示） -->
    <DisplayControlPanel v-if="licenseKeyHash === '5d41402abc4b2a76b9719d911017c592'" />

    <!-- トースト表示 -->
    <ViewBotToast v-if="base.showToasts" />

    <!-- キャラクターサムネイル -->
    <CharacterThumbnails v-if="base.showCharacterIcon" />
  </div>
  <!-- わんコメが起動されていない場合のエラー表示 -->
  <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import ViewBotMessage from '@MainComponents/OmikujiBot/ViewBotMessage.vue'
  import ViewBotToast from '@/MainGenerator/components/OmikujiBot/ViewBotToast.vue'
  import CharacterThumbnails from '@MainComponents/OmikujiBot/CharacterThumbnails.vue'
  import DisplayControlPanel from '@MainComponents/OmikujiBot/DisplayControlPanel.vue'
  import ErrorInitComponent from '@shared/components/error/ErrorInitComponent.vue'
  import GameRankingViewer from '@MainComponents/GameRankingViewer/GameRankingViewer.vue'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores/'
  import { useRuleProcessor } from './scripts/RuleProcess/useRuleProcessor'
  import { useFontFamily } from '@/types/BotComponents/useFontFamily'

  // Piniaストアの使用
  const appStore = useAppStore()
  const ruleProcessor = useRuleProcessor()
  const displayStore = useDisplayStore()
  const { base, licenseKeyHash } = appStore.omikujiData.displaySettings

  // フォントの指定
  const fontClass = computed(() => useFontFamily(base.fontFamily ?? 'default'))

  // 初期化処理
  onMounted(async () => {
    // processors を初期化
    ruleProcessor.initializeProcessor(appStore.omikujiData, appStore.scriptManager)

    // アプリ初期化
    const isInit = await ruleProcessor.initializeApp(appStore.config, (comments) => {
      // コメント処理
      const processedMessages = ruleProcessor.processComments(comments)
      appStore.scheduleBotMessages(processedMessages)
    })

    appStore.setInitialized(isInit)

    if (isInit) {
      // タイマー開始
      ruleProcessor.startTimers((messages) => {
        appStore.scheduleBotMessages(messages)
      })
    }
    // displayStore 初期化
    displayStore.initializeDisplayMode()
  })
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700;900&display=swap');

  .main-container {
    height: 100vh;
    overflow: hidden;
  }
</style>
