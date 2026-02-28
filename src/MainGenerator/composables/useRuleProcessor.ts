// src/MainGenerator/composables/useRuleProcessor.ts
import { watch, onUnmounted } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikujiDataType } from '@/types/OmikujiData/'
import { RuleTimerProcessor } from '@main/scripts/RuleProcess/RuleTimerProcessor'
import { MetaRuleProcessor } from '@main/scripts/RuleProcess/MetaRuleProcessor'
import { useVisibilityAccess } from '../scripts/FeatureAccess/useAccessCheckerMain'

export function useRuleProcessor() {
  const appStore = useAppStore()
  const { isTimer } = useVisibilityAccess()

  let processor: ReturnType<typeof createRuleProcessor> | null = null

  watch(
    () => appStore.status,
    (status) => {
      if (status !== 'ready') return

      // Vite の HMR で残っているなら稼働前にストップ
      if (processor) {
        processor.timer.stop()
        processor.meta.stop()
      }
      console.log('🔄 RuleProcessor起動')

      processor = createRuleProcessor(appStore.data)
      const schedule = appStore.scheduleBotMessages

      if (isTimer.value) {
        console.log('▶️ タイマールール起動')
        processor.timer.start(schedule)
      }

      console.log('▶️ メタルール起動')
      processor.meta.start(schedule)
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (!processor) return
    console.log('🛑 RuleProcessor停止 (unmount)')
    processor.timer.stop()
    processor.meta.stop()
  })
}

/**
 * RuleProcessorファクトリー
 */
function createRuleProcessor(data: OmikujiDataType) {
  const timer = new RuleTimerProcessor(data)
  const meta = new MetaRuleProcessor(data)

  return {
    timer: {
      start: timer.startTimers.bind(timer),
      stop: timer.stopTimers.bind(timer),
    },
    meta: {
      start: meta.startMetaRules.bind(meta),
      stop: meta.stopMetaRules.bind(meta),
    },
  }
}
