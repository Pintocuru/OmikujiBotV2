// src/MainGenerator/scripts/OmikujiResult/BotMessageFactory.ts
import {
  BotMessageCommentSchema,
  BotMessageRankingSchema,
  BotMessageType,
  RankingMessageType,
} from '@/types/MainGenerator/BotMessageSchema'
import { CharacterColorType, CharacterType, OmikujiDataType } from '@/types/OmikujiData/'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { resolveSettingMode } from '@/common/FeatureAccess/SettingMode'
import { hasAccessPure } from '@/common/FeatureAccess/useAccessChecker'
import { CreateBotMessageParams } from '@/types/MainGenerator/OmikujiResultTypes'

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
   * BotMessageを生成（bubble + ranking）
   */
  createBotMessages(params: CreateBotMessageParams): BotMessageType[] {
    const messages: BotMessageType[] = []
    const { characterKey, iconKey, delaySeconds, isToast, bubble, ranking, omiken } = params

    const character = this.getCharacter(characterKey)
    const isChar = this.isCharacterMode && character
    const colorType = isToast ? 'toast' : 'bubble'
    const color = isChar ? character.color : this.defaultColors[colorType]

    // 1. コメントメッセージを作成
    const commentMessage = BotMessageCommentSchema.parse({
      type: 'comment',
      delaySeconds,
      bubble: {
        name: isChar ? character.displayName : '',
        message: bubble,
        isToast,
        characterKey: isChar ? characterKey : null,
        iconKey,
        color,
      },
      display: { visible: true },
      user: omiken ? UserNameSchema.parse(omiken) : undefined,
    })

    messages.push(commentMessage)

    // 2. ランキングメッセージを作成（存在する場合のみ）
    if (ranking) {
      const rankingMessage = BotMessageRankingSchema.parse({
        type: 'ranking',
        delaySeconds: delaySeconds + 0.1, // 吹き出しより少し遅らせる
        ranking,
        user: omiken ? UserNameSchema.parse(omiken) : undefined,
      })

      messages.push(rankingMessage)
    }

    return messages
  }

  /**
   * ランキングのみのBotMessageを生成
   */
  createRankingMessage(delaySeconds: number, ranking: RankingMessageType, omiken?: OmikenCommentType): BotMessageType {
    return BotMessageRankingSchema.parse({
      type: 'ranking',
      delaySeconds,
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
