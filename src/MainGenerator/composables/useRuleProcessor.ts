// src/MainGenerator/scripts/RuleProcess/useRuleProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiDataType } from '@/types/OmikujiData/'
import { RuleTimerProcessor } from '../scripts/RuleProcess/RuleTimerProcessor'
import { MetaRuleProcessor } from '../scripts/RuleProcess/MetaRuleProcessor'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * ルールプロセッサーのファクトリー関数
 */
export function useRuleProcessor(data: OmikujiDataType) {
  // この実行コンテキスト専用のインスタンス
  const timerProcessor = new RuleTimerProcessor(data)
  const metaRuleProcessor = new MetaRuleProcessor(data)

  /**
   * アプリ初期化（コメント購読の開始）
   */
  const initializeApp = async (onCommentsReceived: (comments: OmikenCommentType[]) => void): Promise<boolean> => {
    try {
      return await GetOmikenComments(onCommentsReceived)
    } catch (error) {
      console.error('❌ 初期化エラー:', error)
      return false
    }
  }

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
    initializeApp,
    startTimers,
    stopTimers,
    startMetaRules,
    stopMetaRules,
  }
}
