// src\ConfigMaker\scripts\CharacterManager\useCharacterManager.ts
import { computed } from 'vue'
import { CharacterManager } from '@main/scripts/CharacterManager/CharacterManager'
import { CharacterEmotionType } from '@/types/OmikujiData'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

export const useCharacterManager = () => {
  const omikujiStore = useOmikujiStore()

  const manager = computed(() => new CharacterManager(omikujiStore.data))

  const showCharacters = computed(() => {
    if (!manager.value.isCharacterMode) return { center: ['default'] }
    return omikujiStore.data.components.bubble.showCharacters
  })

  return {
    manager,
    isCharacter: computed(() => manager.value.isCharacterMode),
    characterMap: computed(() => Object.fromEntries(manager.value.characterMap)),
    characterArray: computed(() => manager.value.characterArray),
    showCharacters,

    // メソッドは関数として返す
    isValidCharacter: (key: string | null) => manager.value.isValidCharacter(key),
    iconSrc: (key: string | null, emotion: CharacterEmotionType) => manager.value.iconSrc(key, emotion),
  }
}
