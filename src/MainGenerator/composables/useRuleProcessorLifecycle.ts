// src/MainGenerator/composables/useRuleProcessorLifecycle.ts
import { ComputedRef, watchEffect } from 'vue'
import { useRuleProcessor } from '@/MainGenerator/composables/useRuleProcessor'
import { useAppStore } from '../stores/useAppStore'

export function useRuleProcessorLifecycle(isTimer: ComputedRef<boolean>) {
  watchEffect((onCleanup) => {
    const appStore = useAppStore()
    if (!appStore.isInitialized) return

    console.log('🔄 RuleProcessor起動')

    const ruleProcessor = useRuleProcessor(appStore.data)

    // タイマールール
    if (isTimer.value) {
      console.log('▶️ タイマールール起動')
      ruleProcessor.startTimers((messages) => appStore.scheduleBotMessages(messages))
    }

    // メタルール
    console.log('▶️ メタルール起動')
    ruleProcessor.startMetaRules((messages) => appStore.scheduleBotMessages(messages))

    // クリーンアップ
    onCleanup(() => {
      console.log('🛑 RuleProcessor停止')
      ruleProcessor.stopTimers()
      ruleProcessor.stopMetaRules()
    })
  })
}
