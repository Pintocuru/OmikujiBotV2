// src\MainGenerator\scripts\RuleProcess\RuleProcessor.ts
import { RuleCommentProcessor } from '@/MainGenerator/scripts/RuleProcess/RuleCommentProcessor'
import { Comment } from '@onecomme.com/onesdk/'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { RuleTimerProcessor } from './RuleTimerProcessor'
import { GetUserComments } from '@shared/sdk/subscribe/GetUserComments'
import { ConfigUserType } from '@shared/types'

export function useRuleProcessor() {
  /**
   * 初期化
   */
  let commentProcessor: RuleCommentProcessor | null = null
  let timerProcessor: RuleTimerProcessor | null = null
  const initializeProcessor = (omikujiData: OmikujiDataType, scriptManager: any) => {
    commentProcessor = new RuleCommentProcessor(omikujiData, scriptManager)
    timerProcessor = new RuleTimerProcessor(omikujiData)
  }

  const initializeApp = async (
    config: ConfigUserType,
    onCommentsReceived: (comments: Comment[]) => void
  ): Promise<boolean> => {
    try {
      const isInit = await GetUserComments(config).fetchComments(onCommentsReceived)
      return isInit
    } catch (error) {
      console.error('初期化エラー:', error)
      return false
    }
  }

  /**
   * comment Rules
   */

  const processComments = (comments: Comment[]): BotMessage[] => {
    if (!commentProcessor) return []
    return commentProcessor.respondToComments(comments)
  }

  /**
   * Timer Rules
   */

  const startTimers = (callback: (messages: BotMessage[]) => void) => {
    if (timerProcessor) timerProcessor.startTimers(callback)
  }

  const stopTimers = () => {
    if (timerProcessor) timerProcessor.stopTimers()
  }

  return {
    initializeProcessor,
    initializeApp,
    processComments,
    startTimers,
    stopTimers,
  }
}
