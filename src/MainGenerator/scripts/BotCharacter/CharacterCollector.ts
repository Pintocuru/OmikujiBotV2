// src/MainGenerator/script/omikujiProcess/CharacterCollector.ts
import { BotMessage, BotMessageSchema, CharacterType, OmikujiDataType, PostActionMessageType } from '@/types/'

export class CharacterCollector {
  constructor(private readonly omikujiData: OmikujiDataType) {}

  /**
   * 使用されているキャラクターデータを取得する
   */
  getUsedCharacterData(): Record<string, CharacterType> | null {
    const characters = this.omikujiData.characters
    if (Object.keys(characters).length === 0) return null
    return characters
  }

  /**
   * 使用されているキャラクターのプリセットを配列で取得する
   */
  getUsedCharacterArray(): CharacterType[] {
    const characters = this.omikujiData.characters
    if (Object.keys(characters).length === 0) return []
    return Object.values(characters).sort((a, b) => a.order - b.order)
  }

  /**
   * キャラクターコントロールパネル用テストメッセージ
   */
  generateTestMessage(postAction: PostActionMessageType, isToast: boolean = false): BotMessage {
    const character = this.omikujiData.characters[postAction.characterKey]

    return BotMessageSchema.parse({
      name: character?.name,
      characterKey: postAction.characterKey,
      iconKey: postAction.iconKey,
      profileImage: character?.image?.[postAction.iconKey] || character?.image?.default || null,
      enterMotion: postAction.enterMotion,
      sound: postAction.sound,
      comment: postAction.message.bubble,
      isToast,
      color: character?.color,
    })
  }
}
