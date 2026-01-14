// src/common/CharacterManager/createCharacterManager.ts
import { Ref, computed } from 'vue'
import { CharacterEmotionType, CharacterType, ShowCharactersSchema, characterEmotions } from '@/types/'

export const createCharacterManager = (charactersMap: Ref<Record<string, CharacterType>>) => {
  // ソート済みキャラクター配列
  const charactersArray = computed(() => Object.values(charactersMap.value).sort((a, b) => a.order - b.order))

  // orderが一番若いキャラクター
  const firstCharacter = computed(() => {
    const keys = Object.keys(charactersMap.value)
    if (keys.length === 0) return undefined
    return charactersMap.value[keys[0]]
  })

  // キャラクター名を取得
  const getCharacterName = (characterKey: string): string => {
    const character = charactersArray.value.find((char) => char.key === characterKey)
    return character?.name || ''
  }

  /**
   * キャラクターが有効（表示可能）かどうかを判定
   * - キャラクターオブジェクトが存在する
   * - かつ、最低1つの感情に画像が存在する
   */
  const isValidCharacter = (characterKey: string | null): boolean => {
    if (!characterKey) return false

    const character = charactersMap.value[characterKey]
    if (!character) return false

    // 少なくとも1つの感情に画像があるかチェック
    const hasAnyImage = characterEmotions.some((emotion) => {
      const imagePaths = character.image?.[emotion]
      return imagePaths?.some((path: string) => path && path.trim() !== '')
    })

    return hasAnyImage
  }

  const getAvailableEmotions = (characterKey: string | null): CharacterEmotionType[] => {
    // キャラクターが無効なら空配列を返す
    if (!characterKey || !isValidCharacter(characterKey)) return []

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

  const hasEmotion = (characterKey: string | null, iconKey: CharacterEmotionType): boolean => {
    if (!characterKey) return false
    const character = charactersMap.value[characterKey]
    const imagePath = character?.image?.[iconKey]
    return imagePath?.some((path: string) => path && path.trim() !== '') ?? false
  }

  const iconSrc = (characterKey: string | null, iconKey: CharacterEmotionType): string[] => {
    if (!characterKey) return []
    return charactersMap.value[characterKey]?.image?.[iconKey]
  }

  return {
    // 配列・基本データ
    charactersArray,
    firstCharacter,

    // 名前取得
    getCharacterName,

    // 検証
    isValidCharacter,

    // 感情関連
    getAvailableEmotions,
    hasEmotion,
    iconSrc,

    // デフォルト値
    defaultShowCharacters,
  }
}

// 後方互換性のためのエイリアス
export const createCharacterEmotions = createCharacterManager
