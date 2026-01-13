// src/ConfigMaker/components/rules/CharacterChanger/composables/usePostActionCharacters.ts
import { PostActionType, ActionSetType } from '@/types/OmikujiData/'

/**
 * PostAction内のキャラクター情報を扱うユーティリティ
 */
export function usePostActionCharacters() {
  /**
   * PostAction配列から使用されているキャラクターキーを抽出
   */
  const extractCharacterKeys = (postActions: PostActionType[]): string[] => {
    const keys = new Set<string>()

    postActions.forEach((action) => {
      if (action.actionType === 'message') {
        keys.add(action.characterKey)
      }
    })

    return Array.from(keys).sort()
  }

  /**
   * ActionSetから使用されているキャラクターキーを抽出（GameScriptsを含む）
   */
  const extractCharacterKeysFromActionSet = (actionSet: ActionSetType): string[] => {
    const keys = new Set<string>()

    // PostActionsから抽出
    actionSet.postActions.forEach((action) => {
      if (action.actionType === 'message') {
        keys.add(action.characterKey)
      }
    })

    // GameScriptsから抽出
    if (actionSet.type === 'gameScripts' && actionSet.gameScripts.characterKey) {
      keys.add(actionSet.gameScripts.characterKey)
    }

    return Array.from(keys).sort()
  }

  /**
   * 各キャラクターの使用箇所数をカウント
   */
  const countCharacterUsage = (postActions: PostActionType[]): Record<string, number> => {
    const counts: Record<string, number> = {}

    postActions.forEach((action) => {
      if (action.actionType === 'message') {
        const key = action.characterKey
        counts[key] = (counts[key] || 0) + 1
      }
    })

    return counts
  }

  /**
   * ActionSetからキャラクター使用箇所数をカウント（GameScriptsを含む）
   */
  const countCharacterUsageFromActionSet = (actionSet: ActionSetType): Record<string, number> => {
    const counts: Record<string, number> = {}

    // PostActionsからカウント
    actionSet.postActions.forEach((action) => {
      if (action.actionType === 'message') {
        const key = action.characterKey
        counts[key] = (counts[key] || 0) + 1
      }
    })

    // GameScriptsからカウント
    if (actionSet.type === 'gameScripts' && actionSet.gameScripts.characterKey) {
      const key = actionSet.gameScripts.characterKey
      counts[key] = (counts[key] || 0) + 1
    }

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
  const applyCharacterMappingsToActionSet = (
    actionSet: ActionSetType,
    mappings: Record<string, string>
  ): ActionSetType => {
    const newActionSet = { ...actionSet }

    // PostActionsを更新
    newActionSet.postActions = applyCharacterMappings(actionSet.postActions, mappings)

    // GameScriptsを更新
    if (actionSet.type === 'gameScripts' && actionSet.gameScripts.characterKey) {
      const newCharacterKey = mappings[actionSet.gameScripts.characterKey]
      if (newCharacterKey) {
        newActionSet.gameScripts = {
          ...actionSet.gameScripts,
          characterKey: newCharacterKey,
        }
      }
    }

    return newActionSet
  }

  return {
    extractCharacterKeys,
    extractCharacterKeysFromActionSet,
    countCharacterUsage,
    countCharacterUsageFromActionSet,
    applyCharacterMappings,
    applyCharacterMappingsToActionSet,
  }
}
