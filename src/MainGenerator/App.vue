<!-- src/MainGenerator/App.vue -->
<template>
  <div v-if="appStore.isInitialized" class="h-screen overflow-hidden" :class="[fontClass]" data-theme="transparent">
    <!-- 動的コンポーネント表示 -->
    <template v-for="item in activeComponents" :key="item?.slot">
      <component v-if="item" :is="item.component" :class="item.classes" v-bind="item.props" />
    </template>

    <!-- meta -->
    <MetaDebugPanel v-if="0" />
  </div>

  <!-- わんコメが起動されていない場合のエラー表示 -->
  <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import MetaDebugPanel from '@main/ui/MetaDebugPanel.vue'
  import { useFontFamily } from '@/types/MainGenerator/useFontFamily'
  import { RuleCommentProcessor } from '@main/scripts/RuleProcess/RuleCommentProcessor'
  import { useRuleProcessor } from '@main/scripts/RuleProcess/RuleProcessor'
  import { useAppStore } from '@main/stores/useAppStore'
  import ErrorInitComponent from '@shared/components/error/ErrorInfo.vue'
  import { generatorApi } from '@config/dev/services/generatorApi'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import { COMPONENT_MAPPINGS } from './ui/ComponentMapping'

  // Pinia Store
  const appStore = useAppStore()
  const conditions = computed(() => appStore.data.components.conditions)
  const { isComment, isTimer } = useVisibilityAccess()

  // フォントの指定（commonStyleから取得）
  const fontClass = computed(() => useFontFamily(appStore.data.components.commonStyle.fontFamily ?? 'default'))

  // アクティブなコンポーネントを動的に取得
  const activeComponents = computed(() => {
    return conditions.value
      .map((condition) => {
        const mapping = COMPONENT_MAPPINGS.find((m) => m.kind === condition.kind)
        if (!mapping) return null

        if (
          mapping.shouldRender &&
          !mapping.shouldRender({
            isComment: isComment.value,
            isTimer: isTimer.value,
          })
        ) {
          return null
        }

        return {
          slot: condition.slot,
          component: mapping.component,
          classes: mapping.classes,
          props: mapping.props,
        }
      })
      .filter(Boolean)
  })

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
