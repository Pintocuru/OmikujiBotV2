// src\MainGenerator\scripts\CharacterManager\useCharacterManager.ts
import { computed } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { CharacterManager } from '../CharacterManager/CharacterManager'
import { CharacterColorType, CharacterEmotionType, ShowCharactersSchema } from '@/types/OmikujiData'
import { BotMessageBubbleType } from '@/types'

/**
 * Vueコンポーネント用：CharacterManager のリアクティブなラッパー
 * ロジックの実体は CharacterManager クラスに集約されている
 */
export const useCharacterManager = () => {
  const appStore = useAppStore()

  // CharacterManager のインスタンス
  const manager = computed(() => new CharacterManager(appStore.data))
  const isCharacter = computed(() => manager.value.isCharacterMode)
  const characterMap = computed(() => Object.fromEntries(manager.value.characterMap))
  const characterArray = computed(() => manager.value.characterArray)

  const isValidCharacter = (key: string | null) => manager.value.isValidCharacter(key)
  const resolveEmotion = (key: string, emotion: CharacterEmotionType) => manager.value.resolveEmotion(key, emotion)
  const iconSrc = (key: string | null, emotion: CharacterEmotionType) => manager.value.iconSrc(key, emotion)

  // 表示設定 (bubbleコンポーネントの表示位置設定などで使用)
  const showCharacters = computed(() => {
    // キャラクターモードが無効な場合は、空を返す
    if (!manager.value.isCharacterMode) return ShowCharactersSchema.parse({})
    return appStore.data.components.bubble.showCharacters
  })

  // メッセージからキャラクター画像を返す
  const getCharacterLayers = (message: BotMessageBubbleType): string[] => {
    if (!isCharacter.value) return []

    const key = message.bubble?.characterKey
    if (!key || !manager.value.isValidCharacter(key)) return []

    const emotion = manager.value.resolveEmotion(key, message.bubble?.iconKey)
    return manager.value.iconSrc(key, emotion)
  }

  return {
    // Manager インスタンス自体へのアクセスを提供
    manager: manager.value,

    // リアクティブなプロパティ
    isCharacter,
    characterMap,
    characterArray,
    showCharacters,

    //
    getCharacterLayers,
    getCharacterColor: (key: string | null) => manager.value.getCharacterColor(key),

    // ロジックメソッド（後方互換性と利便性のため）
    isValidCharacter,
    hasImage: (key: string | null) => manager.value.hasImage(key),
    resolveEmotion,
    iconSrc,
  }
}
