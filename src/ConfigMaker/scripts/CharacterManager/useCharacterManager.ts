// src\ConfigMaker\scripts\CharacterManager\useCharacterManager.ts
import { computed } from 'vue'
import { CharacterManager } from '@main/scripts/CharacterManager/CharacterManager'
import { CharacterEmotionType, ShowCharactersSchema } from '@/types/OmikujiData'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

/**
 * ConfigMaker用：CharacterManager のリアクティブなラッパー
 */
export const useCharacterManager = () => {
  const omikujiStore = useOmikujiStore()

  // インスタンスの生成管理
  const manager = computed(() => new CharacterManager(omikujiStore.data))

  // キャラクター表示設定（ConfigMaker独自のデフォルト値を考慮）
  const showCharacters = computed(() => {
    if (!manager.value.isCharacterMode) {
      // プレビュー用に最小限の設定を返す
      return { center: ['default'] }
    }
    return omikujiStore.data.components.settings.bubble.showCharacters
  })

  return {
    manager,
    isCharacter: computed(() => manager.value.isCharacterMode),

    // ConfigMaker側で Object 形式が必須な場合のみ Object.fromEntries を使用
    characterMap: computed(() => Object.fromEntries(manager.value.characterMap)),

    characterArray: computed(() => manager.value.characterArray),
    showCharacters,

    // メソッド類を公開（Main側とインターフェースを合わせる）
    getCharacterColor: (key: string | null) => manager.value.getCharacterColor(key),
    isValidCharacter: (key: string | null) => manager.value.isValidCharacter(key),
    iconSrc: (key: string | null, emotion: CharacterEmotionType) => manager.value.iconSrc(key, emotion),
    resolveEmotion: (key: string | null, emotion: CharacterEmotionType) => manager.value.resolveEmotion(key, emotion),
    resolveCharacter: (data: { characterKey: string | null; iconKey: CharacterEmotionType }) =>
      manager.value.resolveCharacter(data),
  }
}
