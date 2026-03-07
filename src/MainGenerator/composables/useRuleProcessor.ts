// src/MainGenerator/composables/useRuleProcessor.ts
import { watch, onUnmounted } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { EventTimerProcessor } from '@/MainGenerator/scripts/EventProcess/TimerProcessor'
import { EventMetaProcessor } from '@/MainGenerator/scripts/EventProcess/MetaProcessor'
import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'

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

      processor = createRuleProcessor()

      if (isTimer.value) {
        console.log('▶️ タイマーイベント起動')
        processor.timer.start()
      }

      console.log('▶️ メタイベント起動')
      processor.meta.start()
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
function createRuleProcessor() {
  const timer = new EventTimerProcessor()
  const meta = new EventMetaProcessor()

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
