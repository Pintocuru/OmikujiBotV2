<!-- src/MainGenerator/App.vue -->
<template>
  <div v-if="appStore.isInitialized" class="main-container" :class="[fontClass]" data-theme="transparent">
    <!-- OmikujiBot -->
    <OmikujiBot />
  </div>

  <!-- わんコメが起動されていない場合のエラー表示 -->
  <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useFontFamily } from '@/types/BotComponents/useFontFamily'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { useDisplayStore } from '@/MainGenerator/stores/useDisplayStore'
  import { useRuleProcessor } from './scripts/RuleProcess/RuleProcessor'
  import ErrorInitComponent from '@shared/components/error/ErrorInitComponent.vue'

  // 新規分割したコンポーネント
  import OmikujiBot from './packages/OmikujiBot/OmikujiBot.vue'

  // Pinia Store
  const appStore = useAppStore()
  const displayStore = useDisplayStore()
  const ruleProcessor = useRuleProcessor()

  const base = computed(() => appStore.data.displaySettings.base)
  // フォントの指定
  const fontClass = computed(() => useFontFamily(base.value.fontFamily ?? 'default'))

  // 初期化処理
  onMounted(async () => {
    const isInit = await ruleProcessor.initializeApp(appStore.userConfig, (comments) => {
      // コメント処理
      const processedMessages = ruleProcessor.processComments(comments)
      appStore.scheduleBotMessages(processedMessages)
    })

    appStore.setInitialized(isInit)

    // タイマー開始
    if (isInit) {
      ruleProcessor.startTimers((messages) => {
        appStore.scheduleBotMessages(messages)
      })
    }

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
