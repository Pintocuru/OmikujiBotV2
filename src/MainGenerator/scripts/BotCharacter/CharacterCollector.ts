// src/MainGenerator/script/omikujiProcess/CharacterCollector.ts
import { CharacterType, OmikujiDataType } from '@/types/'

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
   * Firstのキャラクター
   */
  getFirstCharacter(): CharacterType | null {
    const characters = this.omikujiData.characters
    if (Object.keys(characters).length === 0) return null
    return Object.values(characters)[0]
  }
}
