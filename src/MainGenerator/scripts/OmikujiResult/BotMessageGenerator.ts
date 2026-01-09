// src/MainGenerator/scripts/OmikujiResult/BotMessageGenerator.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { PostActionType, PostActionMessageType, PostActionSoundType, OmikujiDataType } from '@/types/OmikujiData/'
import { playSoundDelay, playRpgVoiceLoop } from '@sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { MessageProcessor } from './MessageProcessor'
import { BotMessageFactory } from './BotMessageFactory'

/**
 * PostActionからBotMessageを生成し、音声を制御するクラス
 *
 * 主な責務:
 * - PostActionの種類に応じた処理の振り分け
 * - BotMessageの生成（MessageProcessorとBotMessageFactoryに委譲）
 * - 音声再生の制御
 *
 * ⚠️ 重要: 変数プレースホルダーはOmikujiResultProcessorで既に処理済みです
 */
export class BotMessageGenerator {
  private messageProcessor: MessageProcessor
  private messageFactory: BotMessageFactory

  constructor(omikujiData: OmikujiDataType) {
    this.messageProcessor = new MessageProcessor()
    this.messageFactory = new BotMessageFactory(omikujiData)
  }

  /**
   * 複数のPostActionからBotMessageの配列を生成
   *
   * @param postActions - 処理対象のPostAction配列（変数プレースホルダー処理済み）
   * @param omiken - コメント情報（オプション）
   * @returns 生成されたBotMessage配列
   */
  generateMessages(postActions: PostActionType[], omiken?: OmikenCommentType): BotMessageType[] {
    const messages: BotMessageType[] = []

    for (const action of postActions) {
      switch (action.actionType) {
        case 'message':
          messages.push(...this.handleMessageAction(action, omiken))
          break
        case 'sound':
          this.handleSoundAction(action)
          break
        case 'wordParty':
        case 'actionSet':
          // 別処理系でハンドリング済み
          break
        default:
          const _exhaustiveCheck: never = action
          console.warn('Unknown action type:', _exhaustiveCheck)
      }
    }

    return messages
  }

  /**
   * messageアクションの処理
   *
   * ⚠️ processedContent は OmikujiResultProcessor で処理済みのデータを使用
   */
  private handleMessageAction(postAction: PostActionMessageType, omiken?: OmikenCommentType): BotMessageType[] {
    const delaySeconds = this.calculateDelay(postAction)

    // 処理済みコンテンツの抽出（再処理は行わない）
    const processedContent = this.messageProcessor.extractMessageContent(postAction.message)

    // メッセージタイプの判定
    const messageTypes = this.messageProcessor.determineMessageTypes(postAction, processedContent)

    // メッセージがない場合は音声のみ再生
    if (!messageTypes.hasBubble && !messageTypes.hasToast && !messageTypes.hasRanking) {
      this.playSound(postAction.sound, delaySeconds)
      return []
    }

    const messages: BotMessageType[] = []

    // bubble メッセージ生成
    if (messageTypes.hasBubble) {
      const message = this.messageFactory.createBotMessage({
        postAction,
        delaySeconds,
        messageType: 'bubble',
        messageText: processedContent.finalBubble!,
        ranking: processedContent.ranking,
        omiken,
      })
      messages.push(message)
      this.playRpgVoice(postAction.characterKey, processedContent.finalBubble!, delaySeconds)
    }
    // toast メッセージ生成
    else if (messageTypes.hasToast) {
      const message = this.messageFactory.createBotMessage({
        postAction,
        delaySeconds,
        messageType: 'toast',
        messageText: processedContent.finalBubble!,
        ranking: processedContent.ranking,
        omiken,
      })
      messages.push(message)
    }
    // ranking のみの場合
    else if (messageTypes.hasRanking) {
      const message = this.messageFactory.createRankingOnlyMessage(delaySeconds, processedContent.ranking!, omiken)
      messages.push(message)
    }

    this.playSound(postAction.sound, delaySeconds)

    return messages
  }

  /**
   * soundアクションの処理
   */
  private handleSoundAction(postAction: PostActionSoundType): void {
    const delaySeconds = this.calculateDelay(postAction)
    this.playSound(postAction.sound, delaySeconds)
  }

  /**
   * RPG風音声の再生
   */
  private playRpgVoice(characterKey: string, bubble: string, delaySeconds: number): void {
    const character = this.messageFactory.getCharacter(characterKey)
    const displayOption = character?.displayOption
    if (!displayOption) return

    const { mode, rpgVoice } = displayOption
    if (mode === 'rpgVoice' && rpgVoice) {
      playRpgVoiceLoop(bubble, rpgVoice, delaySeconds)
    }
  }

  /**
   * 音声再生
   */
  private playSound(sound: string | undefined, delaySeconds: number): void {
    if (sound?.trim()) {
      playSoundDelay(sound, delaySeconds)
    }
  }

  /**
   * 遅延時間の計算
   */
  private calculateDelay(postAction: PostActionType): number {
    return postAction.delaySeconds + POST_SETTINGS.basicDelaySeconds
  }
}
