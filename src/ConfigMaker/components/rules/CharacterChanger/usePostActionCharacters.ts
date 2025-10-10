// src/ConfigMaker/components/rules/CharacterChanger/composables/usePostActionCharacters.ts
import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'

/**
 * PostAction内のキャラクター情報を扱うユーティリティ
 */
export function usePostActionCharacters() {
  /**
   * PostActionがキャラクターを必要とするかチェック
   */
  const isCharacterRequired = (actionType: string): boolean => {
    return actionType === 'message' || actionType === 'toast'
  }

  /**
   * PostAction配列から使用されているキャラクターキーを抽出
   */
  const extractCharacterKeys = (postActions: PostActionType[]): string[] => {
    const keys = new Set<string>()

    postActions.forEach((action) => {
      if (isCharacterRequired(action.actionType) && action.characterKey !== undefined) {
        keys.add(action.characterKey)
      }
    })

    return Array.from(keys).sort()
  }

  /**
   * 各キャラクターの使用箇所数をカウント
   */
  const countCharacterUsage = (postActions: PostActionType[]): Record<string, number> => {
    const counts: Record<string, number> = {}

    postActions.forEach((action) => {
      if (isCharacterRequired(action.actionType) && action.characterKey !== undefined) {
        const key = action.characterKey
        counts[key] = (counts[key] || 0) + 1
      }
    })

    return counts
  }

  /**
   * キャラクターマッピングに基づいてPostAction配列を更新
   */
  const applyCharacterMappings = (
    postActions: PostActionType[],
    mappings: Record<string, string>
  ): PostActionType[] => {
    return postActions.map((action) => {
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
    })
  }

  return {
    isCharacterRequired,
    extractCharacterKeys,
    countCharacterUsage,
    applyCharacterMappings,
  }
}
