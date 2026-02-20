// src/MainGenerator/composables/useRuleProcessor.ts
import { OmikujiDataType } from '@/types/OmikujiData/'
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { RuleTimerProcessor } from '@main/scripts/RuleProcess/RuleTimerProcessor'
import { MetaRuleProcessor } from '@main/scripts/RuleProcess/MetaRuleProcessor'

/**
 * ルールプロセッサーのファクトリー関数
 */
export function useRuleProcessor(data: OmikujiDataType) {
  // この実行コンテキスト専用のインスタンス
  const timerProcessor = new RuleTimerProcessor(data)
  const metaRuleProcessor = new MetaRuleProcessor(data)

  /**
   * タイマールールの開始
   */
  const startTimers = (callback: (messages: BotMessageType[]) => void) => {
    timerProcessor.startTimers(callback)
  }

  /**
   * タイマールールの停止
   */
  const stopTimers = () => {
    timerProcessor.stopTimers()
  }

  /**
   * メタルールの開始
   */
  const startMetaRules = (callback: (messages: BotMessageType[]) => void) => {
    metaRuleProcessor.startMetaRules(callback)
  }

  /**
   * メタルールの停止
   */
  const stopMetaRules = () => {
    metaRuleProcessor.stopMetaRules()
  }

  return {
    startTimers,
    stopTimers,
    startMetaRules,
    stopMetaRules,
  }
}
