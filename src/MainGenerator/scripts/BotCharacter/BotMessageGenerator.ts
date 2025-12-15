// src/MainGenerator/utils/commentProcessor/BotMessageGenerator.ts
import { BotMessage, BotMessageSchema } from '@/types/BotComponents/BotMessageSchema'
import { PostActionType, PostActionMessageType, PostActionSoundType } from '@/types/OmikujiData/OmikujiSchema'
import { CharacterEmotionType, CharacterType } from '@/types/OmikujiData/CharacterSchema'
import { DefaultCharacterManager } from './BotMessageDefaultCharacter'
import { playSoundDelay, playRpgVoiceLoop } from '@/Toolkit/sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'

export class BotMessageGenerator {
  constructor(private readonly characters: Record<string, CharacterType>) {}

  /**
   * 複数のPostActionからBotMessageの配列を生成
   */
  generateMessages(postActions: PostActionType[]): BotMessage[] {
    const messages: BotMessage[] = []

    for (const action of postActions) {
      // actionType で分岐処理
      switch (action.actionType) {
        case 'message':
          messages.push(...this.generateMessageAction(action))
          break
        case 'sound':
          this.handleSoundAction(action)
          break
        case 'wordParty':
          // wordParty は別の処理系で処理されるため、ここではスキップ
          break
        case 'actionSet':
          // actionSet は別の処理系で展開されるため、ここではスキップ
          break
        default:
          // exhaustive check
          const _exhaustiveCheck: never = action
          console.warn('Unknown action type:', _exhaustiveCheck)
      }
    }

    return messages
  }

  /**
   * PostActionMessageType の処理
   */
  private generateMessageAction(postAction: PostActionMessageType): BotMessage[] {
    const character = this.getSafeCharacter(postAction.characterKey)
    const baseDelaySeconds = this.calculateBaseDelay(postAction)

    const messages: BotMessage[] = []

    // bubble メッセージの生成
    if (postAction.message.bubble?.trim()) {
      messages.push(this.createBotMessage(postAction, character, baseDelaySeconds, 'bubble'))
      this.handleRpgVoice(character, postAction.message.bubble, baseDelaySeconds)
    }

    // toast メッセージの生成
    if (postAction.message.toast?.trim()) {
      messages.push(this.createBotMessage(postAction, character, baseDelaySeconds, 'toast'))
      this.handleRpgVoice(character, postAction.message.toast, baseDelaySeconds)
    }

    // サウンド再生（message actionType に含まれる場合）
    if (postAction.sound?.trim()) {
      playSoundDelay(postAction.sound, baseDelaySeconds)
    }

    return messages
  }

  /**
   * PostActionSoundType の処理
   */
  private handleSoundAction(postAction: PostActionSoundType): void {
    if (!postAction.sound?.trim()) return

    const delaySeconds = this.calculateBaseDelay(postAction)
    playSoundDelay(postAction.sound, delaySeconds)
  }

  /**
   * BotMessageオブジェクトを作成
   */
  private createBotMessage(
    postAction: PostActionMessageType,
    character: CharacterType,
    delaySeconds: number,
    messageType: 'bubble' | 'toast'
  ): BotMessage {
    return BotMessageSchema.parse({
      name: character.displayName,
      characterKey: postAction.characterKey,
      iconKey: postAction.iconKey,
      profileImage: character.displayOption.isIconDisplay ? this.getCharacterIcon(character, postAction.iconKey) : null,
      sound: postAction.sound,
      comment:
        messageType === 'bubble'
          ? { bubble: postAction.message.bubble, ...postAction.message }
          : { toast: postAction.message.toast, ...postAction.message },
      color: character.color,
      delaySeconds,
    })
  }

  /**
   * RPG風の音声ループを再生(条件に応じて)
   */
  private handleRpgVoice(character: CharacterType, messageContent: string, baseDelaySeconds: number): void {
    const { isOneCommePost, isVoice, isRpgVoice } = character.displayOption
    const shouldPlayRpgVoice = !isOneCommePost && !isVoice && !!isRpgVoice

    if (shouldPlayRpgVoice) playRpgVoiceLoop(messageContent, baseDelaySeconds)
  }

  /**
   * 基本遅延時間を計算
   */
  private calculateBaseDelay(postAction: PostActionType): number {
    return postAction.delaySeconds + POST_SETTINGS.basicDelaySeconds
  }

  /**
   * キャラクターを安全に取得(エラー時はデフォルトを返す)
   */
  private getSafeCharacter(characterKey: string): CharacterType {
    try {
      return DefaultCharacterManager.getCharacterOrDefault(characterKey, this.characters)
    } catch (error) {
      console.warn('Character resolution failed, using default character:', {
        characterKey,
        error: error instanceof Error ? error.message : error,
      })
      return DefaultCharacterManager.getDefaultCharacterByIndex(0)
    }
  }

  /**
   * キャラクターアイコンの取得
   */
  private getCharacterIcon(character: CharacterType, iconKey: CharacterEmotionType): string[] | string | null {
    const iconMap = character?.image
    if (!iconMap) return null

    // 指定されたアイコンを優先
    const iconValue = iconMap[iconKey]
    if (iconValue && iconValue !== '') return iconValue

    // デフォルトアイコンにフォールバック
    const defaultIcon = iconMap['default']
    return defaultIcon && defaultIcon !== '' ? defaultIcon : null
  }
}
