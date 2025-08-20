// composables/useRuleProcessor.ts
import { CommentProcessor } from '@MainScripts/omikujiProcess/CommentProcessor'
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { TimerProcessor } from '../omikujiProcess/timerProcessor'
import { GetUserComments } from '@shared/sdk/subscribe/GetUserComments'

export function useRuleProcessor() {
  /**
   * 初期化
   */
  let commentProcessor: CommentProcessor | null = null
  let timerProcessor: TimerProcessor | null = null
  const initializeProcessor = (omikujiData: OmikujiDataType, scriptManager: any) => {
    commentProcessor = new CommentProcessor(omikujiData, scriptManager)
    timerProcessor = new TimerProcessor(omikujiData)
  }

  const initializeApp = async (config: any, onCommentsReceived: (comments: Comment[]) => void): Promise<boolean> => {
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
