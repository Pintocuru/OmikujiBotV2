// src/MainGenerator/scripts/RuleProcess/RuleProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiDataType } from '@/types/OmikujiData/'
import { RuleTimerProcessor } from './RuleTimerProcessor'
import { MetaRuleProcessor } from './MetaRuleProcessor'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * ルールプロセッサーのファクトリー関数
 *
 * この関数は呼び出されるたびに新しいプロセッサーインスタンスを生成します。
 * watchEffect と組み合わせることで、データ更新時に古いインスタンスを
 * 確実に破棄し、新しいインスタンスで再起動できます。
 *
 * @param data - おみくじデータ。このデータに基づいてタイマーやメタルールを実行します。
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
