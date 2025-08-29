// src/MainGenerator/script/omikujiProcess/CharacterCollector.ts
import { BotMessage, BotMessageSchema, CharacterType, OmikujiDataType, OmikujiItemType, PostActionType } from '@/types/'

export class CharacterCollector {
  constructor(private readonly omikujiData: OmikujiDataType) {}

  /**
   * postActionsからcharacterKeyを収集する
   * isEnabled が存在しないならtrue
   */
  private extractCharacterKeys(
    rules: Record<string, { isEnabled?: boolean; omikuji: OmikujiItemType[] }>
  ): Set<string> {
    const keys = new Set<string>()
    Object.values(rules).forEach((rule) => {
      if (rule.isEnabled === false) return
      rule.omikuji.forEach(({ postActions }) =>
        postActions.forEach(({ characterKey }) => {
          if (characterKey) keys.add(characterKey)
        })
      )
    })
    return keys
  }

  /**
   * 有効なルールから使用されているキャラクターキーを収集する
   */
  private collectCharacterKeys(): Set<string> {
    const keys = new Set<string>()
    ;[this.omikujiData.comments, this.omikujiData.timers].forEach((ruleSet) => {
      this.extractCharacterKeys(ruleSet).forEach((key) => keys.add(key))
    })
    return keys
  }

  /**
   * 使用されているキャラクターデータを取得する
   */
  getUsedCharacterData(): Record<string, CharacterType> | null {
    const keys = this.collectCharacterKeys()
    const characters = this.omikujiData.characters
    if (Object.keys(characters).length === 0) return null
    return Object.fromEntries(
      Array.from(keys)
        .filter((key) => characters[key])
        .map((key) => [key, characters[key]])
    )
  }

  /**
   * 使用されているキャラクターのプリセットを配列で取得する
   */
  getUsedCharacterArray(): CharacterType[] {
    const usedCharacterData = this.getUsedCharacterData()
    if (!usedCharacterData) return []
    return Object.values(usedCharacterData).sort((a, b) => a.order - b.order)
  }

  /**
   * キャラクターコントロールパネル用テストメッセージ
   */
  generateTestMessage(postAction: PostActionType, isToast: boolean = false): BotMessage {
    const character = this.omikujiData.characters[postAction.characterKey]

    return BotMessageSchema.parse({
      name: character?.name,
      characterKey: postAction.characterKey,
      iconKey: postAction.iconKey,
      profileImage: character?.image?.[postAction.iconKey] || character?.image?.default || null,
      enterMotion: postAction.enterMotion,
      sound: postAction.sound,
      comment: postAction.messageContent,
      isToast,
      color: character?.color,
    })
  }
}
