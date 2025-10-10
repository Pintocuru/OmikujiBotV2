// src/ConfigMaker/components/rules/CharacterChanger/composables/useCharacterData.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

/**
 * キャラクターデータの取得・検証を担当するコンポーザブル
 */
export function useCharacterData() {
  const omikujiStore = useOmikujiStore()

  /**
   * ソート済みキャラクター配列
   */
  const charactersArray = computed(() => omikujiStore.getCategoryArray('characters').sort((a, b) => a.order - b.order))

  /**
   * キャラクター名を取得
   */
  const getCharacterName = (characterKey: string): string => {
    const character = charactersArray.value.find((char) => char.key === characterKey)
    return character?.name || ''
  }

  /**
   * キャラクターIDが有効かチェック
   */
  const isValidCharacter = (characterId: string): boolean => {
    return !!getCharacterName(characterId)
  }

  return {
    charactersArray,
    getCharacterName,
    isValidCharacter,
  }
}
