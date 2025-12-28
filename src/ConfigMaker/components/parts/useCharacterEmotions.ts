// src\ConfigMaker\components\parts\useCharacterEmotions.ts
import { computed } from 'vue'
import { CharacterEmotionType, characterEmotions } from '@/types/'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

export const useCharacterEmotions = () => {
  const omikujiStore = useOmikujiStore()
  const charactersMap = computed(() => omikujiStore.getCategoryMap('characters'))

  const getAvailableEmotions = (characterKey: string): CharacterEmotionType[] => {
    const character = charactersMap.value[characterKey]
    if (!character?.image) return []

    return characterEmotions.filter((emotion) => {
      const imagePath = character.image?.[emotion]
      return imagePath.some((path) => path && path.trim() !== '')
    })
  }

  const hasEmotion = (characterKey: string, iconKey: CharacterEmotionType): boolean => {
    const character = charactersMap.value[characterKey]
    const imagePath = character?.image?.[iconKey]
    return imagePath.some((path) => path && path.trim() !== '')
  }

  const iconSrc = (characterKey: string, iconKey: CharacterEmotionType) => {
    return charactersMap.value[characterKey]?.image?.[iconKey]
  }

  return {
    charactersMap,
    getAvailableEmotions,
    hasEmotion,
    iconSrc,
  }
}
