// src/MainGenerator/scripts/CharacterManager/useCharacterManager.ts
import { computed } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { CharacterManager } from '../CharacterManager/CharacterManager'
import { CharacterEmotionType, ShowCharactersSchema } from '@/types/OmikujiData'
import { BotMessageBubbleType } from '@/types'

/**
 * Vueコンポーネント用：CharacterManager のリアクティブなラッパー
 */
export const useCharacterManager = () => {
  const appStore = useAppStore()

  /**
   * CharacterManagerのシングルトンインスタンス（計算プロパティとして）
   * appStore.dataが更新されると自動的に再生成される
   */
  const manager = computed(() => new CharacterManager(appStore.data))

  /**
   * キャラクターモードが有効かどうか
   */
  const isCharacter = computed(() => manager.value.isCharacterMode)

  /**
   * キャラクターの配列（順序付き）
   */
  const characterMap = computed(() => Object.fromEntries(manager.value.characterMap))
  const characterArray = computed(() => manager.value.characterArray)

  /**
   * キャラクター表示設定
   */
  const showCharacters = computed(() => {
    if (!manager.value.isCharacterMode) return ShowCharactersSchema.parse({})
    return appStore.data.components.settings.bubble.showCharacters
  })

  /**
   * メッセージからキャラクター画像レイヤーを取得
   */
  const getCharacterLayers = (message: BotMessageBubbleType): string[] => {
    if (!manager.value.isCharacterMode) return []

    const key = message.bubble?.characterKey
    if (!key || !manager.value.isValidCharacter(key)) return []

    const emotion = manager.value.resolveEmotion(key, message.bubble?.iconKey)
    return manager.value.iconSrc(key, emotion)
  }

  /**
   * キャラクターキーから色情報を取得
   */
  const getCharacterColor = (characterKey: string | null) => {
    return manager.value.getCharacterColor(characterKey)
  }

  /**
   * キャラクターが有効な定義を持っているか確認
   */
  const isValidCharacter = (characterKey: string | null): boolean => {
    return manager.value.isValidCharacter(characterKey)
  }

  /**
   * キャラクターが画像を持っているか確認
   */
  const hasImage = (characterKey: string | null): boolean => {
    return manager.value.hasImage(characterKey)
  }

  /**
   * 表情を解決（画像がない場合はdefaultにフォールバック）
   */
  const resolveEmotion = (characterKey: string, iconKey: CharacterEmotionType): CharacterEmotionType => {
    return manager.value.resolveEmotion(characterKey, iconKey)
  }

  /**
   * アイコン画像のURLを取得
   */
  const iconSrc = (characterKey: string | null, iconKey: CharacterEmotionType): string[] => {
    return manager.value.iconSrc(characterKey, iconKey)
  }

  const resolveCharacter = (data: { characterKey: string | null; iconKey: CharacterEmotionType }) => {
    return manager.value.resolveCharacter(data)
  }

  return {
    // リアクティブなプロパティ
    isCharacter,
    characterMap,
    characterArray,
    showCharacters,

    // メソッド（通常の関数として返す - computedでラップする必要はない）
    getCharacterLayers,
    getCharacterColor,
    isValidCharacter,
    hasImage,
    resolveEmotion,
    iconSrc,
    resolveCharacter,
  }
}
