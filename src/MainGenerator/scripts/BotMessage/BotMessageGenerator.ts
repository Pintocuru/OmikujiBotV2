// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\MainGenerator\scripts\BotMessage\BotMessageGenerator.ts
import { BotMessage, BotMessageSchema } from '@/types/MainGenerator/BotMessageSchema'
import { PostActionType, PostActionMessageType, PostActionSoundType } from '@/types/OmikujiData/OmikujiSchema'
import { CharacterColorType, CharacterType } from '@/types/OmikujiData/CharacterSchema'
import { playSoundDelay, playRpgVoiceLoop } from '@/common/sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { resolveSettingMode, SettingMode } from '@/common/FeatureAccess/SettingMode'
import { OmikujiDataType } from '@/types'
import { AccessLevelType } from '@shared/types'

export class BotMessageGenerator {
  // キャラクター検索を高速化するためのMap
  private characterMap: Map<string, CharacterType>
  private isCharacterMode: boolean
  private defaultColors: { bubble: CharacterColorType; toast: CharacterColorType }

  constructor(omikujiData: OmikujiDataType) {
    // 初期化時に一度だけMap化
    this.characterMap = new Map(Object.values(omikujiData.characters).map((char) => [char.key, char]))
    this.isCharacterMode = checkIsCharacter(omikujiData)
    this.defaultColors = {
      bubble: omikujiData.components.bubble.defaultColor,
      toast: omikujiData.components.toast.defaultColor,
    }
  }

  /**
   * 複数のPostActionからBotMessageの配列を生成
   */
  generateMessages(postActions: PostActionType[]): BotMessage[] {
    const messages: BotMessage[] = []

    for (const action of postActions) {
      switch (action.actionType) {
        case 'message':
          messages.push(...this.generateMessageAction(action))
          break
        case 'sound':
          this.handleSoundAction(action)
          break
        case 'wordParty':
        case 'actionSet':
          // 別処理系でハンドリング
          break
        default:
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
    const delaySeconds = this.calculateBaseDelay(postAction)
    const { message: msg } = postAction
    const messages: BotMessage[] = []

    // メッセージ内容の有無チェック
    const hasBubble = this.hasContent(msg.bubble)
    const hasToast = this.hasContent(msg.toast)
    const hasRanking = !!msg.ranking

    // 何もメッセージがない場合は音声のみ再生
    if (!hasBubble && !hasToast && !hasRanking) {
      this.playSoundIfExists(postAction.sound, delaySeconds)
      return messages
    }

    // bubble メッセージ処理
    if (hasBubble) {
      messages.push(this.createBotMessage(postAction, character, delaySeconds, 'bubble'))
      this.handleRpgVoiceIfNeeded(character, msg.bubble!, delaySeconds)
    }

    // toast メッセージ処理
    else if (hasToast) {
      messages.push(this.createBotMessage(postAction, character, delaySeconds, 'toast'))
    }

    // ranking / user のみの場合
    else if (hasRanking) {
      messages.push(
        BotMessageSchema.parse({
          delaySeconds,
          message: {
            ranking: msg.ranking,
            user: msg.user,
          },
        })
      )
    }

    // 音声再生
    this.playSoundIfExists(postAction.sound, delaySeconds)

    return messages
  }

  /**
   * PostActionSoundType の処理
   */
  private handleSoundAction(postAction: PostActionSoundType): void {
    const delaySeconds = this.calculateBaseDelay(postAction)
    this.playSoundIfExists(postAction.sound, delaySeconds)
  }

  /**
   * BotMessageオブジェクトを作成
   */
  private createBotMessage(
    postAction: PostActionMessageType,
    character: CharacterType | null,
    delaySeconds: number,
    messageType: 'bubble' | 'toast'
  ): BotMessage {
    const isChar = this.isCharacterMode && !!character
    const color = isChar ? character!.color : this.defaultColors[messageType]

    return BotMessageSchema.parse({
      name: isChar ? character!.displayName : '',
      characterKey: isChar ? postAction.characterKey : null,
      iconKey: postAction.iconKey,
      delaySeconds,
      color,
      message:
        messageType === 'bubble'
          ? { bubble: postAction.message.bubble, ...postAction.message }
          : { toast: postAction.message.toast, ...postAction.message },
    })
  }

  /**
   * RPG風の音声ループを再生(条件に応じて)
   */
  private handleRpgVoiceIfNeeded(character: CharacterType | null, bubble: string, baseDelaySeconds: number): void {
    if (!character?.displayOption) return

    const { mode, rpgVoice } = character.displayOption
    if (mode === 'rpgVoice' && rpgVoice) {
      playRpgVoiceLoop(bubble, rpgVoice, baseDelaySeconds)
    }
  }

  /**
   * 音声を再生(存在する場合のみ)
   */
  private playSoundIfExists(sound: string | undefined, delaySeconds: number): void {
    if (sound?.trim()) {
      playSoundDelay(sound, delaySeconds)
    }
  }

  /**
   * コンテンツの有無チェック
   */
  private hasContent(content: string | undefined): boolean {
    return !!content?.trim()
  }

  /**
   * 基本遅延時間を計算
   */
  private calculateBaseDelay(postAction: PostActionType): number {
    return postAction.delaySeconds + POST_SETTINGS.basicDelaySeconds
  }

  /**
   * キャラクター取得(Map使用で高速化)
   */
  private getSafeCharacter(characterKey: string): CharacterType | null {
    try {
      return this.characterMap.get(characterKey) ?? null
    } catch (error) {
      console.warn('Character resolution failed:', {
        characterKey,
        error: error instanceof Error ? error.message : error,
      })
      return null
    }
  }
}

/**
 * IsCharacter
 * TODO:他でも使うなら個別化する
 */
export function checkIsCharacter(omikujiData: OmikujiDataType): boolean {
  const { featureUsage, characters, settings } = omikujiData
  const usageCharacters = featureUsage.usage.characters
  const hasCharacters = Object.keys(characters).length > 0
  const mode = resolveSettingMode(settings.licenseKeyHash)

  return hasAccessPureByMode(usageCharacters, mode) && hasCharacters
}

export function hasAccessPureByMode(level: AccessLevelType, mode: SettingMode): boolean {
  if (level === 'experimental') return false
  if (level === 'internal') return mode === 'godMode'
  if (level === 'pro') return mode === 'pro' || mode === 'godMode'
  return true
}
