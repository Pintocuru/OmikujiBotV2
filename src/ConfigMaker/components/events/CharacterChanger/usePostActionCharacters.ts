// src/ConfigMaker/components/events/CharacterChanger/usePostActionCharacters.ts
import { PostFlowType, ActionSetType } from '@/types/OmikujiData/'

/**
 * PostAction内のキャラクター情報を扱うユーティリティ
 */
export function usePostActionCharacters() {
  /**
   * ActionSetから使用されているキャラクターキーを抽出（GameScriptsを含む）
   */
  const extractCharacterKeys = (actionSet: ActionSetType): string[] => {
    const keys = new Set<string>()

    actionSet.postActions.forEach((action) => {
      if (action.actionType === 'message' && action.characterKey?.trim()) {
        keys.add(action.characterKey)
      }
    })

    if (actionSet.type === 'gameScripts') {
      const key = actionSet.gameScripts.characterKey ?? ''
      keys.add(key)
    }

    return Array.from(keys).sort()
  }

  /**
   * ActionSetからキャラクター使用箇所数をカウント（GameScriptsを含む）
   */
  const countCharacterUsage = (actionSet: ActionSetType): Record<string, number> => {
    const counts: Record<string, number> = {}

    // PostActionsからカウント
    if (actionSet.type === 'postActions') {
      actionSet.postActions.forEach((action) => {
        if (action.actionType === 'message') {
          const key = action.characterKey
          if (key) counts[key] = (counts[key] || 0) + 1
        }
      })
    }

    // GameScriptsからカウント
    else if (actionSet.type === 'gameScripts') {
      const key = actionSet.gameScripts.characterKey
      if (key) counts[key] = counts[key] = (counts[key] || 0) + 1
    }

    return counts
  }

  /**
   * キャラクターマッピングに基づいてPostAction配列を更新
   */
  const mapPostActionsCharacterKey = (
    postActions: PostFlowType[],
    mappings: Record<string, string>
  ): PostFlowType[] => {
    return postActions.map((action) => {
      if (action.actionType === 'message') {
        const newCharacterId = mappings[action.characterKey || '']
        if (newCharacterId) {
          return { ...action, characterKey: newCharacterId }
        }
      }
      return action
    })
  }

  /**
   * キャラクターマッピングに基づいてActionSetを更新（GameScriptsを含む）
   */
  const applyCharacterMappings = (actionSet: ActionSetType, mappings: Record<string, string>): ActionSetType => {
    const newActionSet = { ...actionSet }

    // PostActionsを更新
    newActionSet.postActions = mapPostActionsCharacterKey(actionSet.postActions, mappings)

    // GameScriptsを更新
    if (actionSet.type === 'gameScripts') {
      const oldKey = actionSet.gameScripts.characterKey

      // null のときはマッピングしない
      if (oldKey !== null) {
        const newKey = mappings[oldKey]
        if (newKey) {
          newActionSet.gameScripts = {
            ...actionSet.gameScripts,
            characterKey: newKey,
          }
        }
      }
    }

    return newActionSet
  }

  return {
    extractCharacterKeys,
    countCharacterUsage,
    applyCharacterMappings,
  }
}
