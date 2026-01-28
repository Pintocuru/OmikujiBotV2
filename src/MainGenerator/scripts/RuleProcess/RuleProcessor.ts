// src/MainGenerator/scripts/RuleProcess/RuleProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { RuleTimerProcessor } from './RuleTimerProcessor'
import { MetaRuleProcessor } from './MetaRuleProcessor'
import { MetaStateService } from '../MetaState/MetaStateService'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

let timerProcessorSingleton: RuleTimerProcessor | null = null
let metaRuleProcessorSingleton: MetaRuleProcessor | null = null

export function useRuleProcessor() {
  if (!timerProcessorSingleton) {
    timerProcessorSingleton = new RuleTimerProcessor()
  }

  if (!metaRuleProcessorSingleton) {
    metaRuleProcessorSingleton = new MetaRuleProcessor()
  }

  const initializeApp = async (onCommentsReceived: (comments: OmikenCommentType[]) => void): Promise<boolean> => {
    try {
      return await GetOmikenComments(onCommentsReceived)
    } catch (error) {
      console.error('初期化エラー:', error)
      return false
    }
  }

  /**
   * Timer Rules
   */
  const startTimers = (callback: (messages: BotMessageType[]) => void) => {
    timerProcessorSingleton!.startTimers(callback)
  }

  const stopTimers = () => {
    timerProcessorSingleton!.stopTimers()
  }

  /**
   * Meta Rules
   */
  const startMetaRules = (callback: (messages: BotMessageType[]) => void) => {
    metaRuleProcessorSingleton!.startMetaRules(callback)
  }

  return {
    initializeApp,
    startTimers,
    stopTimers,
    startMetaRules,
  }
}
