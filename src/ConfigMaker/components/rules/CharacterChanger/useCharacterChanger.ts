// src\ConfigMaker\components\rules\CharacterChanger\useCharacterChanger.ts
import { computed, ref } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'

/**
 * キャラクター変更に必要な共通ロジックを提供するコンポーザブル
 */
export function useCharacterChanger() {
  const omikujiStore = useOmikujiStore()

  const charactersArray = computed(() => omikujiStore.getCategoryArray('characters').sort((a, b) => a.order - b.order))

  /**
   * キャラクター名を取得
   */
  const getCharacterName = (characterId: string): string => {
    const character = charactersArray.value.find((char) => char.id === characterId)
    return character?.name || ''
  }

  /**
   * PostActionがキャラクターを必要とするかチェック
   * actionTypeが'message'または'toast'の場合のみtrue
   */
  const isCharacterRequired = (actionType: string): boolean => {
    return actionType === 'message' || actionType === 'toast'
  }

  /**
   * おみくじセットから使用されているキャラクターキーを抽出
   * actionTypeが'message'または'toast'のもののみ対象
   */
  const extractCharacterKeys = (omikujiSets: OmikujiItemType[]): string[] => {
    const keys = new Set<string>()

    omikujiSets.forEach((omikuji) => {
      omikuji.postActions?.forEach((action) => {
        // actionTypeが'message'または'toast'の場合のみチェック
        if (isCharacterRequired(action.actionType) && action.characterKey !== undefined) {
          keys.add(action.characterKey)
        }
      })
    })

    return Array.from(keys).sort()
  }

  /**
   * 各キャラクターの使用箇所数をカウント
   */
  const countCharacterUsage = (omikujiSets: OmikujiItemType[]): Record<string, number> => {
    const counts: Record<string, number> = {}

    omikujiSets.forEach((omikuji) => {
      omikuji.postActions?.forEach((action) => {
        if (isCharacterRequired(action.actionType) && action.characterKey !== undefined) {
          const key = action.characterKey
          counts[key] = (counts[key] || 0) + 1
        }
      })
    })

    return counts
  }

  /**
   * 存在しないキャラクターの数をカウント
   */
  const countInvalidCharacters = (characterKeys: string[]): number => {
    return characterKeys.filter((charKey) => !getCharacterName(charKey)).length
  }

  /**
   * キャラクターマッピングに基づいておみくじセットを更新
   */
  const applyCharacterMappings = (
    omikujiSets: OmikujiItemType[],
    mappings: Record<string, string>
  ): OmikujiItemType[] => {
    return omikujiSets.map((omikuji) => ({
      ...omikuji,
      postActions:
        omikuji.postActions?.map((action) => {
          // actionTypeが'message'または'toast'の場合のみ変更を適用
          if (isCharacterRequired(action.actionType)) {
            const newCharacterId = mappings[action.characterKey || '']
            if (newCharacterId) {
              return {
                ...action,
                characterKey: newCharacterId,
              }
            }
          }
          return action
        }) || [],
    }))
  }

  /**
   * モーダル状態管理用のヘルパー
   */
  const createModalState = () => {
    const isModalOpen = ref(false)
    const characterMappings = ref<Record<string, string>>({})

    const openModal = (initialMappings?: Record<string, string>) => {
      isModalOpen.value = true
      characterMappings.value = initialMappings || {}
    }

    const closeModal = () => {
      isModalOpen.value = false
      characterMappings.value = {}
    }

    const clearAllMappings = () => {
      characterMappings.value = {}
    }

    const hasChanges = computed(() => {
      return Object.values(characterMappings.value).some((value) => value !== '')
    })

    return {
      isModalOpen,
      characterMappings,
      openModal,
      closeModal,
      clearAllMappings,
      hasChanges,
    }
  }

  return {
    charactersArray,
    getCharacterName,
    isCharacterRequired,
    extractCharacterKeys,
    countCharacterUsage,
    countInvalidCharacters,
    applyCharacterMappings,
    createModalState,
  }
}
