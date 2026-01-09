// src/MainGenerator/scripts/OmikujiResult/BotMessageGenerator.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { PostActionSoundType, OmikujiDataType } from '@/types/OmikujiData/'
import { playSoundDelay, playRpgVoiceLoop } from '@sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { MessageProcessor } from './MessageProcessor'
import { BotMessageFactory } from './BotMessageFactory'
import { ProcessedAction, ProcessedMessageAction } from './OmikujiResultHelper'

/**
 *  ProcessedActionからBotMessageを生成し音声を制御
 */
export class BotMessageGenerator {
  private messageProcessor: MessageProcessor
  private messageFactory: BotMessageFactory

  constructor(omikujiData: OmikujiDataType) {
    this.messageProcessor = new MessageProcessor()
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
        case 'wordParty':
        case 'actionSet':
          break
        default:
          const _exhaustiveCheck: never = action
          console.warn('Unknown action type:', _exhaustiveCheck)
      }
    }

    return messages
  }

  /**
   *  メッセージアクションを処理してBotMessageを生成
   */
  private handleMessageAction(action: ProcessedMessageAction, omiken?: OmikenCommentType): BotMessageType[] {
    const delaySeconds = this.calculateDelay(action)
    const processedContent = this.messageProcessor.extractMessageContent(action)
    const messageTypes = this.messageProcessor.determineMessageTypes(action, processedContent)

    if (!messageTypes.hasBubble && !messageTypes.hasToast && !messageTypes.hasRanking) {
      this.playSound(action.sound, delaySeconds)
      return []
    }

    const messages: BotMessageType[] = []

    if (messageTypes.hasBubble) {
      const message = this.messageFactory.createBotMessage({
        action,
        delaySeconds,
        messageType: 'bubble',
        messageText: processedContent.finalBubble!,
        ranking: processedContent.ranking,
        omiken,
      })
      messages.push(message)
      this.playRpgVoice(action.characterKey, processedContent.finalBubble!, delaySeconds)
    } else if (messageTypes.hasToast) {
      const message = this.messageFactory.createBotMessage({
        action,
        delaySeconds,
        messageType: 'toast',
        messageText: processedContent.finalBubble!,
        ranking: processedContent.ranking,
        omiken,
      })
      messages.push(message)
    } else if (messageTypes.hasRanking) {
      const message = this.messageFactory.createRankingOnlyMessage(delaySeconds, processedContent.ranking!, omiken)
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
