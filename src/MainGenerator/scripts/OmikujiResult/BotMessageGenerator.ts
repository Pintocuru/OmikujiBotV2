// src/MainGenerator/scripts/OmikujiResult/BotMessageGenerator.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { PostActionType, PostActionMessageType, OmikujiDataType } from '@/types/OmikujiData/'
import { playSoundDelay, playRpgVoiceLoop } from '@sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { BotMessageFactory } from './BotMessageFactory'
import { ProcessedMessageContent } from './OmikujiResultHelper'

/**
 * PostActionからBotMessageを生成し音声を制御
 */
export class BotMessageGenerator {
  private messageFactory: BotMessageFactory

  constructor(omikujiData: OmikujiDataType) {
    this.messageFactory = new BotMessageFactory(omikujiData)
  }

  /**
   * PostActionからBotMessageを生成
   */
  generateMessages(actions: PostActionType[], omiken?: OmikenCommentType): BotMessageType[] {
    const messages: BotMessageType[] = []

    for (const action of actions) {
      switch (action.actionType) {
        case 'message':
          messages.push(...this.handleMessageAction(action, omiken))
          break
        case 'sound':
          this.handleSoundAction(action)
          break
        default:
          break
      }
    }

    return messages
  }

  /**
   * メッセージアクションを処理してBotMessageを生成
   */
  private handleMessageAction(action: PostActionMessageType, omiken?: OmikenCommentType): BotMessageType[] {
    const delaySeconds = this.calculateDelay(action)
    const content = this.extractMessageContent(action)
    const { isToast } = content
    const hasBubbleText = !!content.bubble?.trim()

    // メッセージが何もない場合は音声のみ再生
    if (!hasBubbleText && !content.ranking) {
      this.playSound(action.sound, delaySeconds)
      return []
    }

    const messages: BotMessageType[] = []

    // bubbleテキストがある場合
    if (hasBubbleText) {
      const newMessages = this.messageFactory.createBotMessages({
        characterKey: action.characterKey,
        iconKey: action.iconKey,
        delaySeconds,
        isToast,
        bubble: content.bubble!,
        ranking: content.ranking,
        omiken,
      })
      messages.push(...newMessages)

      // toastでない場合のみRPGボイスを再生
      if (!isToast) {
        this.playRpgVoice(action.characterKey, content.bubble!, delaySeconds)
      }
    }
    // ランキングのみの場合
    else if (content.ranking) {
      const message = this.messageFactory.createRankingMessage(delaySeconds, content.ranking, omiken)
      messages.push(message)
    }

    this.playSound(action.sound, delaySeconds)
    return messages
  }

  private handleSoundAction(action: PostActionType): void {
    if (action.actionType !== 'sound') return
    const delaySeconds = this.calculateDelay(action)
    this.playSound(action.sound, delaySeconds)
  }

  /**
   * メッセージアクションから処理済みコンテンツを抽出
   */
  private extractMessageContent(action: PostActionMessageType): ProcessedMessageContent {
    const message = action.message as any

    // __processedがある場合（変数プレースホルダー処理済み）
    if (message.__processed) {
      return message.__processed
    }

    // __processedがない場合は通常のbubbleとisToastのみ
    return {
      bubble: message.bubble || '',
      isToast: message.isToast || false,
      ranking: undefined,
    }
  }

  private playRpgVoice(characterKey: string, bubble: string, delaySeconds: number): void {
    const character = this.messageFactory.getCharacter(characterKey)
    const displayOption = character?.displayOption
    if (!displayOption) return

    const { mode, rpgVoice } = displayOption
    if (mode === 'rpgVoice' && rpgVoice) {
      playRpgVoiceLoop(bubble, rpgVoice, delaySeconds)
    }
  }

  private playSound(sound: string | undefined, delaySeconds: number): void {
    if (sound?.trim()) {
      playSoundDelay(sound, delaySeconds)
    }
  }

  private calculateDelay(action: PostActionType): number {
    return action.delaySeconds + POST_SETTINGS.basicDelaySeconds
  }
}
