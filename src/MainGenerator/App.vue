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
  import { computed, onMounted, watchEffect } from 'vue'
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

  // 初期化処理（一度だけ実行）
  onMounted(async () => {
    const ruleProcessor = useRuleProcessor(appStore.data)

    const isInit = await ruleProcessor.initializeApp((omikens) => {
      if (!isComment.value) return
      const commentProcessor = new RuleCommentProcessor()
      const botMessages = commentProcessor.respondToComments(omikens)
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
    }
  })

  // 副作用の宣言的管理（データ更新時に自動的に再起動）
  watchEffect((onCleanup) => {
    // 初期化が完了していない場合は何もしない
    if (!appStore.isInitialized) return

    console.log('🔄 RuleProcessor起動')

    // この実行サイクル専用のプロセッサーを生成（最新のdataを渡す）
    const ruleProcessor = useRuleProcessor(appStore.data)

    // タイマールールの起動（機能が有効な場合のみ）
    if (isTimer.value) {
      console.log('▶️ タイマールール起動')
      ruleProcessor.startTimers((messages) => appStore.scheduleBotMessages(messages))
    }

    // メタルールの起動（常に有効）
    console.log('▶️ メタルール起動')
    ruleProcessor.startMetaRules((messages) => appStore.scheduleBotMessages(messages))

    // 【最重要】クリーンアップ関数の登録
    // appStore.dataが更新された時、またはコンポーネントがアンマウントされる時に必ず実行される
    onCleanup(() => {
      console.log('🛑 RuleProcessor停止')
      ruleProcessor.stopTimers()
      ruleProcessor.stopMetaRules()
    })
  })
</script>
