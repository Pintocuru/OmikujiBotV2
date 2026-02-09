// src/MainGenerator/scripts/RuleProcess/RuleProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { RuleTimerProcessor } from './RuleTimerProcessor'
import { MetaRuleProcessor } from './MetaRuleProcessor'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

// ⭐ シングルトンを完全に廃止
export function useRuleProcessor() {
  // ⭐ 毎回新しいインスタンスを返す
  let timerProcessor: RuleTimerProcessor | null = null
  let metaRuleProcessor: MetaRuleProcessor | null = null

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
    if (!timerProcessor) {
      console.log('🆕 RuleTimerProcessor を新規生成')
      timerProcessor = new RuleTimerProcessor()
    }
    timerProcessor.startTimers(callback)
  }

  const stopTimers = () => {
    if (timerProcessor) {
      timerProcessor.stopTimers()
      timerProcessor = null // ⭐ 破棄
    }
  }

  /**
   * Meta Rules
   */
  const startMetaRules = (callback: (messages: BotMessageType[]) => void) => {
    if (!metaRuleProcessor) {
      console.log('🆕 MetaRuleProcessor を新規生成')
      metaRuleProcessor = new MetaRuleProcessor()
    }
    metaRuleProcessor.startMetaRules(callback)
  }

  const stopMetaRules = () => {
    if (metaRuleProcessor) {
      // MetaRuleProcessorにstopメソッドがあれば呼ぶ
      metaRuleProcessor = null // ⭐ 破棄
    }
  }

  return {
    initializeApp,
    startTimers,
    stopTimers,
    startMetaRules,
    stopMetaRules, // ⭐ 追加
  }
}
