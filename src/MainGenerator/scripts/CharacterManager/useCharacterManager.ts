// src/MainGenerator/scripts/CharacterManager/useCharacterManager.ts
import { computed } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { CharacterManager } from '../CharacterManager/CharacterManager'
import { CharacterEmotionType, ShowCharactersSchema } from '@/types/OmikujiData'
import { BotMessageBubbleType } from '@/types'

/**
 * Vueコンポーネント用：CharacterManager のリアクティブなラッパー
 * ⭐ すべての戻り値を computed にして、常に最新のデータを参照させる
 */
export const useCharacterManager = () => {
  const appStore = useAppStore()

  // ⭐ dataVersion を明示的に依存関係に含める
  const manager = computed(() => {
    // この computed 内で dataVersion を参照することで、
    // dataVersion が変更されるたびに CharacterManager が再生成される
    const _ = appStore.dataVersion // 依存関係を明示
    return new CharacterManager(appStore.data)
  })

  // ⭐ すべて computed で返す（関数も computed でラップ）
  const isCharacter = computed(() => manager.value.isCharacterMode)
  const characterMap = computed(() => Object.fromEntries(manager.value.characterMap))
  const characterArray = computed(() => manager.value.characterArray)

  // 表示設定
  const showCharacters = computed(() => {
    if (!manager.value.isCharacterMode) return ShowCharactersSchema.parse({})
    return appStore.data.components.settings.bubble.showCharacters
  })

  // ⭐ メソッドも computed 化
  const isValidCharacter = computed(() => (key: string | null) => manager.value.isValidCharacter(key))
  const hasImage = computed(() => (key: string | null) => manager.value.hasImage(key))
  const resolveEmotion = computed(
    () => (key: string, emotion: CharacterEmotionType) => manager.value.resolveEmotion(key, emotion)
  )
  const iconSrc = computed(
    () => (key: string | null, emotion: CharacterEmotionType) => manager.value.iconSrc(key, emotion)
  )
  const getCharacterColor = computed(() => (key: string | null) => manager.value.getCharacterColor(key))

  // メッセージからキャラクター画像を返す
  const getCharacterLayers = computed(() => (message: BotMessageBubbleType): string[] => {
    if (!isCharacter.value) return []

    const key = message.bubble?.characterKey
    if (!key || !manager.value.isValidCharacter(key)) return []

    const emotion = manager.value.resolveEmotion(key, message.bubble?.iconKey)
    return manager.value.iconSrc(key, emotion)
  })

  return {
    // Manager インスタンス自体へのアクセス
    manager,

    // リアクティブなプロパティ（すべて computed）
    isCharacter,
    characterMap,
    characterArray,
    showCharacters,

    // リアクティブなメソッド（すべて computed）
    getCharacterLayers,
    getCharacterColor,
    isValidCharacter,
    hasImage,
    resolveEmotion,
    iconSrc,
  }
}
