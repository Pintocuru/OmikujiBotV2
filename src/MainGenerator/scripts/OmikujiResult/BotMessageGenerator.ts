// src\MainGenerator\scripts\OmikujiResult\BotMessageGenerator.ts
import {
  CreateBotMessageParams,
  ProcessedPostAction,
  VariablePlaceholderResult,
} from '@/types/MainGenerator/OmikujiResultTypes'
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { PostActionMessageType, OmikujiDataType } from '@/types/OmikujiData/'
import { playSoundDelay, playRpgVoiceLoop } from '@sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { BotMessageFactory } from './BotMessageFactory'

/**
 * 処理済みアクションからBotMessageを生成し音声を制御
 */
export class BotMessageGenerator {
  private messageFactory: BotMessageFactory

  constructor(omikujiData: OmikujiDataType) {
    this.messageFactory = new BotMessageFactory(omikujiData)
  }

  /**
   * 解析済みのProcessedPostActionからBotMessageを生成
   */
  generateMessages(processedActions: ProcessedPostAction[], omiken?: OmikenCommentType): BotMessageType[] {
    const messages: BotMessageType[] = []

    for (const item of processedActions) {
      const { action, variableResult } = item
      const delaySeconds = action.delaySeconds + POST_SETTINGS.basicDelaySeconds

      switch (action.actionType) {
        case 'message':
          messages.push(...this.handleMessageAction(action, variableResult, delaySeconds, omiken))
          break
        case 'sound':
          playSoundDelay(action.sound, delaySeconds)
          break
      }
    }

    return messages
  }

  /**
   * メッセージアクションを処理
   * 本文とランキングを「独立して」追加できるように修正
   */
  private handleMessageAction(
    action: PostActionMessageType,
    variableResult: VariablePlaceholderResult | undefined,
    delaySeconds: number,
    omiken?: OmikenCommentType
  ): BotMessageType[] {
    const bubble = action.message.bubble || ''
    const componentKey = variableResult?.componentKey
    const ranking = variableResult?.ranking
    const isToast = action.message.isToast
    const hasBubbleText = !!bubble.trim()

    const messages: BotMessageType[] = []

    // メッセージ本文の生成
    if (hasBubbleText) {
      const params: CreateBotMessageParams = {
        characterKey: action.characterKey,
        iconKey: action.iconKey,
        delaySeconds,
        isToast,
        bubble,
        componentKey,
        ranking,
        omiken,
      }
      messages.push(...this.messageFactory.createBotMessages(params))

      if (!isToast) {
        this.playRpgVoice(action.characterKey, bubble, delaySeconds)
      }
    }

    // ランキング情報のみ
    if (!hasBubbleText && componentKey && ranking) {
      messages.push(this.messageFactory.createRankingMessage(delaySeconds, componentKey, ranking, omiken))
    }

    // 効果音の再生
    playSoundDelay(action.sound, delaySeconds)

    return messages
  }

  /**
   *
   */
  private playRpgVoice(characterKey: string, bubble: string, delaySeconds: number): void {
    const character = this.messageFactory.getCharacter(characterKey)
    const displayOption = character?.displayOption
    if (displayOption?.mode === 'rpgVoice' && displayOption.rpgVoice) {
      playRpgVoiceLoop(bubble, displayOption.rpgVoice, delaySeconds)
    }
  }
}
