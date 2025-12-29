// src\ConfigMaker\scripts\CharacterManager\useCharacterManager.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
import { createCharacterEmotions } from '@/common/CharacterManager/createCharacterManager'

export const useCharacterManager = () => {
  const omikujiStore = useOmikujiStore()
  const charactersMap = computed(() => omikujiStore.data.characters)
  return { charactersMap, ...createCharacterEmotions(charactersMap) }
}
