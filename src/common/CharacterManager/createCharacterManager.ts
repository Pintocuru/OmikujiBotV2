// src/common/CharacterManager/createCharacterManager.ts
// !廃止
import { Ref } from 'vue'
import { CharacterEmotionType, CharacterType } from '@/types/'

export const createCharacterManager = (charactersMap: Ref<Record<string, CharacterType>>) => {
  /**
   * キャラクターが有効（表示可能）かどうかを判定
   * - キャラクターオブジェクトが存在し、defaultがある
   */
  const isValidCharacter = (key: string | null): boolean => {
    const images = key && charactersMap.value[key]?.image?.default
    return Array.isArray(images) && images.some((p) => p.trim())
  }

  // キャラクターとアイコンから画像urlを返す
  const iconSrc = (characterKey: string | null, iconKey: CharacterEmotionType): string[] => {
    if (!characterKey) return []
    return charactersMap.value[characterKey]?.image?.[iconKey]
  }

  return {
    // 検証
    isValidCharacter,

    // 感情関連
    iconSrc,
  }
}
