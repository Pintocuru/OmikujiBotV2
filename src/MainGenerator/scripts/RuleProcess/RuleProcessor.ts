// src/MainGenerator/scripts/RuleProcess/RuleProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { RuleTimerProcessor } from './RuleTimerProcessor'
import { MetaRuleProcessor } from './MetaRuleProcessor'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

let timerProcessor: RuleTimerProcessor | null = null
let metaRuleProcessor: MetaRuleProcessor | null = null

export function useRuleProcessor() {
  if (!timerProcessor) 
    timerProcessor = new RuleTimerProcessor()
  

  if (!metaRuleProcessor) 
    metaRuleProcessor = new MetaRuleProcessor()
  

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
    timerProcessor!.startTimers(callback)
  }

  const stopTimers = () => {
    timerProcessor!.stopTimers()
  }

  /**
   * Meta Rules
   */
  const startMetaRules = (callback: (messages: BotMessageType[]) => void) => {
    metaRuleProcessor!.startMetaRules(callback)
  }

  return {
    initializeApp,
    startTimers,
    stopTimers,
    startMetaRules,
  }
}
