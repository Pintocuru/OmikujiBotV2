// src\MainGenerator\scripts\CharacterManager\useCharacterManager.ts
import { computed } from 'vue'
import { createCharacterEmotions } from '@/common/CharacterManager/createCharacterManager'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'

export const useCharacterManager = () => {
  const appStore = useAppStore()
  const charactersMap = computed(() => appStore.data.characters)
  return { charactersMap, ...createCharacterEmotions(charactersMap) }
}
