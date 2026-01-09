// src/MainGenerator/scripts/OmikujiResult/BotMessageFactory.ts
import { BotMessageType, BotMessageSchema } from '@/types/MainGenerator/BotMessageSchema'
import { CharacterColorType, CharacterType, OmikujiDataType, RankingMessageSchema } from '@/types/OmikujiData/'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { resolveSettingMode } from '@/common/FeatureAccess/SettingMode'
import { hasAccessPure } from '@/common/FeatureAccess/useAccessChecker'
import { ProcessedMessageAction } from './OmikujiResultHelper'

/**
 * BotMessage生成とキャラクター管理
 */
export class BotMessageFactory {
  private characterMap: Map<string, CharacterType>
  private isCharacterMode: boolean
  private defaultColors: { bubble: CharacterColorType; toast: CharacterColorType }

  constructor(omikujiData: OmikujiDataType) {
    this.characterMap = new Map(Object.values(omikujiData.characters).map((char) => [char.key, char]))
    this.isCharacterMode = this.checkIsCharacter(omikujiData)
    this.defaultColors = {
      bubble: omikujiData.components.bubble.defaultColor,
      toast: omikujiData.components.toast.defaultColor,
    }
  }

  /**
   *  BotMessageを生成
   */
  createBotMessage({
    action,
    delaySeconds,
    messageType,
    messageText,
    ranking,
    omiken,
  }: {
    action: ProcessedMessageAction
    delaySeconds: number
    messageType: 'bubble' | 'toast'
    messageText: string
    ranking: ReturnType<typeof RankingMessageSchema.parse> | undefined
    omiken?: OmikenCommentType
  }): BotMessageType {
    const character = this.getCharacter(action.characterKey)
    const isChar = this.isCharacterMode && character
    const color = isChar ? character.color : this.defaultColors[messageType]

    return BotMessageSchema.parse({
      type: omiken ? 'comment' : 'system',
      delaySeconds,
      user: omiken ? UserNameSchema.parse(omiken) : undefined,
      ranking,
      bubble: {
        name: isChar ? character.displayName : '',
        message: messageText,
        isToast: messageType === 'toast',
        characterKey: isChar ? action.characterKey : null,
        iconKey: action.iconKey,
        color,
      },
    })
  }

  /**
   * ランキングのみのBotMessageを生成
   */
  createRankingOnlyMessage(
    delaySeconds: number,
    ranking: ReturnType<typeof RankingMessageSchema.parse>,
    omiken?: OmikenCommentType
  ): BotMessageType {
    return BotMessageSchema.parse({
      delaySeconds,
      type: 'rankingOnly',
      ranking,
      user: omiken ? UserNameSchema.parse(omiken) : undefined,
    })
  }

  getCharacter(characterKey: string): CharacterType | null {
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

  isCharacterModeEnabled(): boolean {
    return this.isCharacterMode
  }

  private checkIsCharacter(omikujiData: OmikujiDataType): boolean {
    const { featureUsage, characters, settings } = omikujiData
    const usageCharacters = featureUsage.usage.characters
    const hasCharacters = Object.keys(characters).length > 0
    const mode = resolveSettingMode(settings.licenseKeyHash)

    return hasAccessPure(usageCharacters, mode) && hasCharacters
  }
}
