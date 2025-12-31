// src\ConfigMaker\scripts\CharacterManager\useCharacterManager.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
import { createCharacterEmotions } from '@/common/CharacterManager/createCharacterManager'

export const useCharacterManager = () => {
  const omikujiStore = useOmikujiStore()

  // Record型キャラクターデータ
  const charactersMap = computed(() => omikujiStore.data.characters)

  return {
    ...createCharacterEmotions(charactersMap),
    charactersMap,
  }
}
