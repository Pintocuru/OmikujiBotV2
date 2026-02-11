// src/MainGenerator/scripts/OmikujiResult/BotMessageFactory.ts
import {
  BotMessageBubbleSchema,
  BotMessageExtraSchema,
  BotMessageExtraType,
  BotMessageType,
  ExtraMessageType,
} from '@/types/MainGenerator/BotMessageSchema'
import { CharacterType, OmikujiDataType } from '@/types/OmikujiData/'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { CreateBotMessageParams } from '@/types/MainGenerator/OmikujiResultTypes'
import { CharacterManager } from '../CharacterManager/CharacterManager'

/**
 * BotMessageの生成を担当
 * キャラクターの解決は CharacterManager に委譲する
 */
export class BotMessageFactory {
  private characterManager: CharacterManager

  constructor(omikujiData: OmikujiDataType) {
    this.characterManager = new CharacterManager(omikujiData)
  }

  /**
   * BotMessageを構築。表示すべき内容がない場合は空配列を返す。
   */
  createBotMessages(params: CreateBotMessageParams): BotMessageType[] {
    const messages: BotMessageType[] = []
    const { delaySeconds, isToast, bubble, componentKey, ranking, omiken } = params

    const hasBubble = bubble.trim().length > 0

    // 表示するものが何もない場合は空配列を返す
    if (!hasBubble && !!ranking) return []

    // 1. キャラクターとアイコンの解決 (Managerに委譲)
    const { characterKey, iconKey } = this.characterManager.resolveCharacter({
      characterKey: params.characterKey,
      iconKey: params.iconKey,
    })

    // 2. キャラクターオブジェクトの取得 (Managerが必ずdefaultを返してくれる)
    const character = this.characterManager.getCharacter(characterKey)

    // 3. コメントメッセージを作成 (本文がある場合のみ)
    if (hasBubble) {
      const commentMessage = BotMessageBubbleSchema.parse({
        delaySeconds,
        bubble: {
          name: character?.displayName || '',
          message: bubble,
          isToast,
          characterKey,
          iconKey,
        },
      })
      messages.push(commentMessage)
    }

    // 4. ランキングメッセージを作成 (存在する場合のみ)
    if (!!componentKey && !!ranking) {
      const rankingMessage = this.createRankingMessage(delaySeconds, componentKey, ranking, omiken)
      messages.push(rankingMessage)
    }

    return messages
  }

  /**
   * ランキングのみのBotMessageを生成
   */
  createRankingMessage(
    delaySeconds: number,
    componentKey: string,
    ranking: ExtraMessageType,
    omiken?: OmikenCommentType
  ): BotMessageExtraType {
    return BotMessageExtraSchema.parse({
      delaySeconds,
      componentKey,
      extra: ranking,
      user: omiken ? UserNameSchema.parse(omiken) : undefined,
    })
  }

  /**
   * Generator 等から参照するための公開メソッド
   */
  getCharacter(characterKey: string | null): CharacterType | null {
    if (!characterKey) return null
    return this.characterManager.getCharacter(characterKey)
  }
}
