// src\MainGenerator\scripts\RuleProcess\RuleProcessor.ts
import { computed, watch } from 'vue'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { RuleTimerProcessor } from './RuleTimerProcessor'
import { GetUserComments } from '@shared/sdk/subscribe/GetUserComments'
import { ConfigUserType } from '@shared/types'
import { Comment } from '@onecomme.com/onesdk/'

export function useRuleProcessor() {
  /**
   * dataが変更されると自動的に新しいインスタンスが作成される
   */
  const timerProcessor = computed(() => new RuleTimerProcessor())

  // 必要に応じて、プロセッサーの変更を監視して追加処理を実行
  watch(timerProcessor, (oldTimerProcessor) => {
    // 古いタイマーを停止
    if (oldTimerProcessor) oldTimerProcessor.stopTimers()
    console.log('プロセッサーが更新されました')
  })

  const initializeApp = async (
    config: ConfigUserType,
    onCommentsReceived: (comments: Comment[]) => void
  ): Promise<boolean> => {
    try {
      return await GetUserComments(config).fetchComments(onCommentsReceived)
    } catch (error) {
      console.error('初期化エラー:', error)
      return false
    }
  }

  /**
   * Timer Rules
   */
  const startTimers = (callback: (messages: BotMessage[]) => void) => {
    timerProcessor.value.startTimers(callback)
  }

  const stopTimers = () => {
    timerProcessor.value.stopTimers()
  }

  return {
    initializeApp,
    startTimers,
    stopTimers,
  }
}
