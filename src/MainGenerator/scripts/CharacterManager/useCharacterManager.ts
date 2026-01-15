// src\MainGenerator\scripts\CharacterManager\useCharacterManager.ts
import { computed } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { CharacterManager } from '../CharacterManager/CharacterManager'
import { CharacterEmotionType, ShowCharactersSchema } from '@/types/OmikujiData'

/**
 * Vueコンポーネント用：CharacterManager のリアクティブなラッパー
 * ロジックの実体は CharacterManager クラスに集約されている
 */
export const useCharacterManager = () => {
  const appStore = useAppStore()

  // CharacterManager のインスタンス
  const manager = computed(() => new CharacterManager(appStore.data))

  // 表示設定 (bubbleコンポーネントの表示位置設定などで使用)
  const showCharacters = computed(() => {
    // キャラクターモードが無効な場合は、中央にデフォルトキャラのみを表示する設定を返す
    if (!manager.value.isCharacterMode) {
      return ShowCharactersSchema.parse({ center: ['default'] })
    }
    return appStore.data.components.bubble.showCharacters
  })

  return {
    // Manager インスタンス自体へのアクセスを提供
    manager: manager.value,

    // リアクティブなプロパティ
    isCharacter: computed(() => manager.value.isCharacterMode),
    characterMap: computed(() => Object.fromEntries(manager.value.characterMap)),
    characterArray: computed(() => manager.value.characterArray),
    showCharacters,

    // ロジックメソッド（後方互換性と利便性のため）
    isValidCharacter: (key: string | null) => manager.value.isValidCharacter(key),
    hasImage: (key: string | null) => manager.value.hasImage(key),
    resolveEmotion: (key: string, emotion: CharacterEmotionType) => manager.value.resolveEmotion(key, emotion),
    iconSrc: (key: string | null, emotion: CharacterEmotionType) => manager.value.iconSrc(key, emotion),
  }
}
