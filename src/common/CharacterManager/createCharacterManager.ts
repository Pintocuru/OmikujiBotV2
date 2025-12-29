// src\common\CharacterManager\createCharacterManager.ts
import { Ref } from 'vue'
import { CharacterEmotionType, CharacterType, ShowCharactersSchema, characterEmotions } from '@/types/'

export const createCharacterEmotions = (charactersMap: Ref<Record<string, CharacterType>>) => {
  /**
   * キャラクターが有効かどうかを判定
   * 条件: image.default に有効なパスが1つ以上含まれていること
   */
  const isValidCharacter = (characterKey: string): boolean => {
    const character = charactersMap.value[characterKey]
    const defaultLayers = character?.image?.default

    // defaultが配列であり、かつ空文字でない要素が1つ以上あるか
    return Array.isArray(defaultLayers) && defaultLayers.some((path: string) => path && path.trim() !== '')
  }

  const getAvailableEmotions = (characterKey: string): CharacterEmotionType[] => {
    // キャラクターが無効なら空配列を返す
    if (!isValidCharacter(characterKey)) return []

    const character = charactersMap.value[characterKey]
    if (!character?.image) return []

    return characterEmotions.filter((emotion) => {
      const imagePath = character.image?.[emotion]
      return imagePath?.some((path: string) => path && path.trim() !== '')
    })
  }

  // キャラクターを表示しないときの showCharacters の default
  const defaultShowCharacters = ShowCharactersSchema.parse({
    center: ['default'],
    slot1: [],
    slot2: [],
    slot3: [],
    slot4: [],
  })

  //
  const hasEmotion = (characterKey: string, iconKey: CharacterEmotionType): boolean => {
    const character = charactersMap.value[characterKey]
    const imagePath = character?.image?.[iconKey]
    return imagePath?.some((path: string) => path && path.trim() !== '') ?? false
  }

  const iconSrc = (characterKey: string, iconKey: CharacterEmotionType) => {
    return charactersMap.value[characterKey]?.image?.[iconKey]
  }

  return {
    defaultShowCharacters,

    isValidCharacter,
    getAvailableEmotions,
    hasEmotion,
    iconSrc,
  }
}
