// src/MainGenerator/scripts/OmikujiResult/BotMessageGenerator.ts
import { BotMessageType, RankingMessageSchema, RankingMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { PostActionType, PostActionMessageType, OmikujiDataType } from '@/types/OmikujiData/'
import { playSoundDelay, playRpgVoiceLoop } from '@sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { BotMessageFactory } from './BotMessageFactory'
import { ProcessedPostAction, VariablePlaceholderResult } from '@/types/MainGenerator/OmikujiResultTypes'

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
          this.playSound(action.sound, delaySeconds)
          break
      }
    }

    return messages
  }

  private handleMessageAction(
    action: PostActionMessageType,
    variableResult: VariablePlaceholderResult | undefined,
    delaySeconds: number,
    omiken?: OmikenCommentType
  ): BotMessageType[] {
    // 1. ランキングデータの変換
    const ranking = this.createRankingMessage(variableResult)
    console.log(variableResult)
    // bubbleは既にProcessor側で置換済み
    const bubbleText = action.message.bubble || ''
    const isToast = action.message.isToast
    const hasBubbleText = !!bubbleText.trim()

    // 表示内容がない場合
    if (!hasBubbleText && !ranking) {
      this.playSound(action.sound, delaySeconds)
      return []
    }

    const messages: BotMessageType[] = []

    if (hasBubbleText) {
      const newMessages = this.messageFactory.createBotMessages({
        characterKey: action.characterKey,
        iconKey: action.iconKey,
        delaySeconds,
        isToast,
        bubble: bubbleText,
        ranking,
        omiken,
      })
      messages.push(...newMessages)

      if (!isToast) {
        this.playRpgVoice(action.characterKey, bubbleText, delaySeconds)
      }
    } else if (ranking) {
      messages.push(this.messageFactory.createRankingMessage(delaySeconds, ranking, omiken))
    }

    this.playSound(action.sound, delaySeconds)
    return messages
  }

  /**
   * VariablePlaceholderResultから正式なRankingMessageTypeを生成
   */
  private createRankingMessage(result?: VariablePlaceholderResult): RankingMessageType | undefined {
    if (!result) return undefined

    try {
      return RankingMessageSchema.parse({
        scriptKey: 'basicList',
        listName: result.name,
        scoreText: result.text,
        symbol: result.symbol,
        variant: result.variant,
        isUniqueUser: result.unique !== 'false',
      })
    } catch (e) {
      return undefined
    }
  }

  private playRpgVoice(characterKey: string, bubble: string, delaySeconds: number): void {
    const character = this.messageFactory.getCharacter(characterKey)
    const displayOption = character?.displayOption
    if (displayOption?.mode === 'rpgVoice' && displayOption.rpgVoice) {
      playRpgVoiceLoop(bubble, displayOption.rpgVoice, delaySeconds)
    }
  }

  private playSound(sound: string | undefined, delaySeconds: number): void {
    if (sound?.trim()) {
      playSoundDelay(sound, delaySeconds)
    }
  }
}
