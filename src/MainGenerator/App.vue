<!-- src/MainGenerator/App.vue -->
<template>
  <div v-if="appStore.isInitialized" class="h-screen overflow-hidden" :class="[fontClass]" data-theme="transparent">
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
  import { useRuleProcessor } from './scripts/RuleProcess/RuleProcessor'
  import ErrorInitComponent from '@shared/components/error/ErrorInfo.vue'

  // 新規分割したコンポーネント
  import OmikujiBot from './packages/OmikujiBot/OmikujiBot.vue'

  // Pinia Store
  const appStore = useAppStore()
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
