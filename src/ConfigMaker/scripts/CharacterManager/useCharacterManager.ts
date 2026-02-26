// src/ConfigMaker/scripts/CharacterManager/useCharacterManager.ts
import { computed } from 'vue'
import { CharacterManager } from '@main/scripts/CharacterManager/CharacterManager'
import { CharacterEmotionType } from '@/types/OmikujiData'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { buildDefaultShowCharacters } from '@main/scripts/CharacterManager/CharacterManagerHelper'

/**
 * ConfigMaker用：CharacterManager のリアクティブなラッパー
 */
export const useCharacterManager = () => {
  const omikujiStore = useOmikujiStore()

  // インスタンスの生成管理
  const manager = computed(() => new CharacterManager(omikujiStore.data))

  // キャラクター表示設定
  const showCharacters = computed(() => {
    if (!manager.value.isCharacterMode) return {}
    const bubble = omikujiStore.data.components.settings.bubble
    if (!bubble) return buildDefaultShowCharacters(omikujiStore.data.characters)
    return bubble.showCharacters
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
    // キャラクター名を取得
    getCharacterName: (key: string | null) => {
      if (!key) return undefined
      return manager.value.characterMap.get(key)?.name
    },
  }
}
