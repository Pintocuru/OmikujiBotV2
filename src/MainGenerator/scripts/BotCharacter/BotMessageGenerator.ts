// src/MainGenerator/utils/commentProcessor/BotMessageGenerator.ts
import { BotMessage, BotMessageSchema, CharacterEmotionType, CharacterType, PostActionType } from '@/types/'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { DefaultCharacterManager } from './BotMessageDefaultCharacter'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { playSoundDelay, playRpgVoiceLoop } from '@/Toolkit/sounds/PlaySound'

export class BotMessageGenerator {
  constructor(private readonly characters: Record<string, CharacterType>) {}

  /**
   * 複数のPostActionからBotMessageの配列を生成
   */
  generateMessages(postActions: PostActionType[]): BotMessage[] {
    const validActions = this.filterValidActions(postActions)
    if (validActions.length === 0) return []

    return validActions.flatMap((action) => this.generateMessage(action))
  }

  /**
   * 有効なアクション（メッセージまたは音声が含まれる）をフィルタリング
   */
  private filterValidActions(postActions: PostActionType[]): PostActionType[] {
    return postActions.filter(
      (action) => action.messageContent?.trim() || action.messageToast?.trim() || action.sound?.trim()
    )
  }

  /**
   * 単一のPostActionからBotMessageを生成（複数の場合もあり）
   */
  private generateMessage(postAction: PostActionType): BotMessage[] {
    const character = this.getSafeCharacter(postAction.characterKey)
    const baseDelaySeconds = this.calculateBaseDelay(postAction)
    const showToasts = this.shouldShowToasts()

    const messages: BotMessage[] = []

    // メッセージコンテンツの生成
    if (postAction.messageContent?.trim()) {
      messages.push(this.createBotMessage(postAction, character, baseDelaySeconds, false, showToasts))
      this.handleRpgVoice(character, postAction.messageContent, baseDelaySeconds)
    }

    // トーストメッセージの生成
    if (postAction.messageToast?.trim()) {
      messages.push(this.createBotMessage(postAction, character, baseDelaySeconds, true, showToasts))
      if (!showToasts) this.handleRpgVoice(character, postAction.messageToast, baseDelaySeconds)
    }

    // サウンド再生
    if (postAction.sound?.trim()) {
      playSoundDelay(postAction.sound, baseDelaySeconds)
    }

    return messages
  }

  /**
   * BotMessageオブジェクトを作成
   */
  private createBotMessage(
    postAction: PostActionType,
    character: CharacterType,
    delaySeconds: number,
    isToast: boolean,
    showToasts: boolean
  ): BotMessage {
    const content = isToast ? postAction.messageToast! : postAction.messageContent

    return BotMessageSchema.parse({
      name: character.displayName,
      characterKey: postAction.characterKey,
      iconKey: postAction.iconKey,
      profileImage: character.displayOption.isIconDisplay ? this.getCharacterIcon(character, postAction.iconKey) : null,
      enterMotion: postAction.enterMotion,
      sound: postAction.sound,
      comment: content,
      isToast: showToasts ? isToast : false,
      color: character.color,
      delaySeconds,
    })
  }

  /**
   * RPG風の音声ループを再生（条件に応じて）
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
   * トースト表示設定を取得
   */
  private shouldShowToasts(): boolean {
    const appStore = useAppStore()
    return appStore.data.displaySettings.base.showToasts
  }

  /**
   * キャラクターを安全に取得（エラー時はデフォルトを返す）
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
  private getCharacterIcon(character: CharacterType, iconKey: CharacterEmotionType): string | null {
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
