// src/MainGenerator/composables/useRuleProcessor.ts
import { watch, onUnmounted } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { EventTimerProcessor } from '@main/scripts/EventProcess/TimerProcessor'
import { EventServiceProcessor } from '@/MainGenerator/scripts/EventProcess/ServiceProcessor'
import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
import { EventReactionProcessor } from '../scripts/EventProcess/ReactionProcessor'

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
        processor.service.stop()
      }
      console.log('🔄 RuleProcessor起動')

      processor = createRuleProcessor()

      if (isTimer.value) {
        console.log('▶️ タイマーイベント起動')
        processor.timer.start()
      }

      console.log('▶️ サービスメタイベント起動')
      processor.service.start()
      console.log('▶️ リアクションイベント起動')
      processor.reaction.start()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (!processor) return
    console.log('🛑 RuleProcessor停止 (unmount)')
    processor.timer.stop()
    processor.service.stop()
    processor.reaction.stop()
  })
}

/**
 * RuleProcessorファクトリー
 */
function createRuleProcessor() {
  const timer = new EventTimerProcessor()
  const service = new EventServiceProcessor()
  const reaction = new EventReactionProcessor()

  return {
    timer: {
      start: timer.startTimers.bind(timer),
      stop: timer.stopTimers.bind(timer),
    },
    service: {
      start: service.startServices.bind(service),
      stop: service.stopServices.bind(service),
    },
    reaction: {
      start: reaction.startReactions.bind(reaction),
      stop: reaction.stopReactions.bind(reaction),
    },
  }
}
