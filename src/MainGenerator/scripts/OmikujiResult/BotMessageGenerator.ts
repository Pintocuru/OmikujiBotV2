// src/MainGenerator/scripts/OmikujiResult/BotMessageGenerator.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { PostActionSoundType, OmikujiDataType } from '@/types/OmikujiData/'
import { playSoundDelay, playRpgVoiceLoop } from '@sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { BotMessageFactory } from './BotMessageFactory'
import { extractMessageContent, ProcessedAction, ProcessedMessageAction } from './OmikujiResultHelper'

/**
 *  ProcessedActionからBotMessageを生成し音声を制御
 */
export class BotMessageGenerator {
  private messageFactory: BotMessageFactory

  constructor(omikujiData: OmikujiDataType) {
    this.messageFactory = new BotMessageFactory(omikujiData)
  }

  /**
   *  ProcessedActionからBotMessageを生成
   */
  generateMessages(actions: ProcessedAction[], omiken?: OmikenCommentType): BotMessageType[] {
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
   *  メッセージアクションを処理してBotMessageを生成
   */
  private handleMessageAction(action: ProcessedMessageAction, omiken?: OmikenCommentType): BotMessageType[] {
    const delaySeconds = this.calculateDelay(action)
    const content = extractMessageContent(action)
    const { isToast } = action.message
    const hasBubbleText = !!content.bubble?.trim()

    // メッセージが何もない場合は音声のみ再生
    if (!hasBubbleText && !content.ranking) {
      this.playSound(action.sound, delaySeconds)
      return []
    }

    const messages: BotMessageType[] = []

    // bubbleテキストがある場合
    if (hasBubbleText) {
      const message = this.messageFactory.createBotMessage({
        action,
        delaySeconds,
        isToast,
        messageText: content.bubble!,
        ranking: content.ranking,
        omiken,
      })
      messages.push(message)

      // toastでない場合のみRPGボイスを再生
      if (!isToast) {
        this.playRpgVoice(action.characterKey, content.bubble!, delaySeconds)
      }
    }
    // ランキングのみの場合
    else if (content.ranking) {
      const message = this.messageFactory.createRankingOnlyMessage(delaySeconds, content.ranking, omiken)
      messages.push(message)
    }

    this.playSound(action.sound, delaySeconds)
    return messages
  }

  private handleSoundAction(action: PostActionSoundType): void {
    const delaySeconds = this.calculateDelay(action)
    this.playSound(action.sound, delaySeconds)
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

  private calculateDelay(action: ProcessedAction): number {
    return action.delaySeconds + POST_SETTINGS.basicDelaySeconds
  }
}
