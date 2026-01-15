// src\ConfigMaker\scripts\CharacterManager\useCharacterManager.ts
import { computed } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { CharacterManager } from '@main/scripts/CharacterManager/CharacterManager'
import { CharacterEmotionType } from '@/types/OmikujiData'

/**
 * Vueコンポーネント用：CharacterManager のリアクティブなラッパー
 */
export const useCharacterManager = () => {
  const appStore = useAppStore()

  // CharacterManager のインスタンスを算出プロパティで生成
  const manager = computed(() => new CharacterManager(appStore.data))

  // 表示設定 (bubbleコンポーネント等で使用)
  const showCharacters = computed(() => {
    if (!manager.value.isCharacterMode) return { center: ['default'] }
    return appStore.data.components.bubble.showCharacters
  })

  return {
    manager: manager.value,
    isCharacter: computed(() => manager.value.isCharacterMode),
    characterMap: computed(() => Object.fromEntries(manager.value.characterMap)),
    characterArray: computed(() => manager.value.characterArray),
    showCharacters,

    // ロジックメソッド
    isValidCharacter: (key: string | null) => manager.value.isValidCharacter(key),
    iconSrc: (key: string | null, emotion: CharacterEmotionType) => manager.value.iconSrc(key, emotion),
  }
}
