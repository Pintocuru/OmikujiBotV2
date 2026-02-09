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
  import { computed, onMounted, onUnmounted, watch, ref } from 'vue'
  import MetaDebugPanel from '@main/ui/MetaDebugPanel.vue'
  import { useFontFamily } from '@/types/MainGenerator/useFontFamily'
  import { RuleCommentProcessor } from '@main/scripts/RuleProcess/RuleCommentProcessor'
  import { useRuleProcessor } from '@main/scripts/RuleProcess/RuleProcessor'
  import { useAppStore } from '@main/stores/useAppStore'
  import ErrorInitComponent from '@shared/components/error/ErrorInfo.vue'
  import { generatorApi } from '@config/dev/services/generatorApi'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import { COMPONENT_MAPPINGS } from './ui/ComponentMapping'

  const appStore = useAppStore()
  const conditions = computed(() => appStore.data.components.conditions)
  const { isComment, isTimer } = useVisibilityAccess()

  const fontClass = computed(() => useFontFamily(appStore.data.components.commonStyle.fontFamily ?? 'default'))

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

  // ⭐ これらを let に変更して再生成可能にする
  let ruleCommentProcessor = new RuleCommentProcessor()
  let currentRuleProcessor = useRuleProcessor()

  const isRunning = ref(false)

  // データバージョンを監視してProcessorを再起動
  watch(
    () => appStore.dataVersion,
    (newVersion, oldVersion) => {
      if (oldVersion === undefined) return
      if (!isRunning.value) return

      console.log(`🔄 データ更新を検知 (v${oldVersion} → v${newVersion})。全Processorを再起動します。`)

      // 1. 既存のProcessorを停止＆破棄
      currentRuleProcessor.stopTimers()
      currentRuleProcessor.stopMetaRules()

      // 2. 新しいProcessorを生成
      currentRuleProcessor = useRuleProcessor()

      // ⭐ 3. RuleCommentProcessorも再生成
      ruleCommentProcessor = new RuleCommentProcessor()

      // 4. 少し待ってから再起動
      setTimeout(() => {
        if (isTimer.value) {
          console.log('▶️ タイマー再起動')
          currentRuleProcessor.startTimers((messages) => appStore.scheduleBotMessages(messages))
        }
        console.log('▶️ メタルール再起動')
        currentRuleProcessor.startMetaRules((messages) => appStore.scheduleBotMessages(messages))
      }, 100)
    }
  )

  // 初期化処理
  onMounted(async () => {
    const isInit = await currentRuleProcessor.initializeApp((omikens) => {
      if (!isComment.value) return
      // ⭐ 常に最新のruleCommentProcessorを使う
      const botMessages = ruleCommentProcessor.respondToComments(omikens)
      appStore.scheduleBotMessages(botMessages)
    })
    appStore.setInitialized(isInit)

    if (isInit) {
      const isHealth = await generatorApi.getHealth()
      if (isHealth) {
        const lowData = await generatorApi.loadGeneratorConfig()
        if (lowData) {
          appStore.loadData(lowData)
        }
      }

      if (isTimer.value) {
        currentRuleProcessor.startTimers((messages) => appStore.scheduleBotMessages(messages))
      }

      currentRuleProcessor.startMetaRules((messages) => appStore.scheduleBotMessages(messages))

      isRunning.value = true
    }
  })

  onUnmounted(() => {
    console.log('App.vue がアンマウントされました。タイマーを停止します。')
    isRunning.value = false
    currentRuleProcessor.stopTimers()
    currentRuleProcessor.stopMetaRules()
  })
</script>
