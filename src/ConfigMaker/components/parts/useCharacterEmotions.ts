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
      if (typeof imagePath === 'string') {
        return imagePath.trim() !== ''
      } else if (Array.isArray(imagePath)) {
        return imagePath.some((path) => path && path.trim() !== '')
      }
      return false
    })
  }

  const hasEmotion = (characterKey: string, emotion: CharacterEmotionType): boolean => {
    const character = charactersMap.value[characterKey]
    const imagePath = character?.image?.[emotion]

    if (typeof imagePath === 'string') {
      return imagePath.trim() !== ''
    } else if (Array.isArray(imagePath)) {
      return imagePath.some((path) => path && path.trim() !== '')
    }
    return false
  }

  return {
    getAvailableEmotions,
    hasEmotion,
    charactersMap,
  }
}
