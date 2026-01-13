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
    isToast,
    messageText,
    ranking,
    omiken,
  }: {
    action: ProcessedMessageAction
    delaySeconds: number
    isToast: boolean
    messageText: string
    ranking: RankingMessageType | undefined // z.inferで見やすく
    omiken?: OmikenCommentType
  }): BotMessageType[] {
    // 戻り値を配列に変更
    const messages: BotMessageType[] = []

    const character = this.getCharacter(action.characterKey)
    const isChar = this.isCharacterMode && character
    const colorType = isToast ? 'toast' : 'bubble'
    const color = isChar ? character.color : this.defaultColors[colorType]

    // 1. 吹き出しメッセージ (comment) の作成
    const bubble = {
      name: isChar ? character.displayName : '',
      message: messageText,
      isToast,
      characterKey: isChar ? action.characterKey : null,
      iconKey: action.iconKey,
      color,
    }

    const commentData: any = {
      type: 'comment',
      delaySeconds,
      bubble,
      display: { visible: true },
    }

    if (omiken) {
      commentData.user = UserNameSchema.parse(omiken)
    }

    messages.push(BotMessageCommentSchema.parse(commentData))

    // 2. ランキングメッセージ (ranking) の作成
    // rankingデータが存在する場合のみ、別のメッセージとして切り出す
    if (ranking) {
      messages.push(
        BotMessageRankingSchema.parse({
          type: 'ranking',
          // ランキングは吹き出しより少し遅らせる（演出上の調整）
          delaySeconds: delaySeconds + 0.1,
          ranking,
          user: omiken ? UserNameSchema.parse(omiken) : undefined,
        })
      )
    }

    return messages
  }

  /**
   * ランキングのみのBotMessageを生成
   */
  createRankingOnlyMessage(
    delaySeconds: number,
    ranking: RankingMessageType,
    omiken?: OmikenCommentType
  ): BotMessageType {
    if (!ranking) {
      throw new Error('ranking is required for rankingOnly message type')
    }

    return BotMessageRankingSchema.parse({
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
