// src/ConfigMaker/components/events/CharacterChanger/usePostActionCharacters.ts
import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
import { PostFlowType, ActionSetType } from '@/types/OmikujiData/'

/**
 * PostAction内のキャラクター情報を扱うユーティリティ
 */
export function usePostActionCharacters() {
  const { resolveEmotion } = useCharacterManager()

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

  /**
   * iconKeyが不正かどうか（キャラに画像が存在しないiconKey）
   * resolveEmotionがフォールバックするということは不正
   */
  const isInvalidIconKey = (characterKey: string | null, iconKey: string): boolean => {
    if (!characterKey) return false
    return resolveEmotion(characterKey, iconKey) !== iconKey
  }

  /**
   * ActionSetから不正なiconKeyの { characterKey, iconKey } ペアを抽出
   */
  const extractInvalidIconKeyPairs = (actionSet: ActionSetType): { characterKey: string; iconKey: string }[] => {
    const seen = new Set<string>()
    const pairs: { characterKey: string; iconKey: string }[] = []

    actionSet.postActions.forEach((action) => {
      if (action.actionType !== 'message') return
      if (!action.characterKey) return
      if (!isInvalidIconKey(action.characterKey, action.iconKey)) return

      const key = `${action.characterKey}:${action.iconKey}`
      if (!seen.has(key)) {
        seen.add(key)
        pairs.push({ characterKey: action.characterKey, iconKey: action.iconKey })
      }
    })

    return pairs
  }

  /**
   * ActionSetのiconKey使用回数をカウント
   * キーは "characterKey:iconKey" の複合形式
   */
  const countIconKeyUsage = (actionSet: ActionSetType): Record<string, number> => {
    const counts: Record<string, number> = {}

    actionSet.postActions.forEach((action) => {
      if (action.actionType !== 'message') return
      if (!action.characterKey) return
      const key = `${action.characterKey}:${action.iconKey}`
      counts[key] = (counts[key] || 0) + 1
    })

    return counts
  }

  /**
   * iconKeyマッピングを適用してActionSetを更新
   * mappingsのキーは "characterKey:iconKey" 複合形式
   */
  const applyIconKeyMappings = (actionSet: ActionSetType, mappings: Record<string, string>): ActionSetType => {
    const newPostActions = actionSet.postActions.map((action) => {
      if (action.actionType !== 'message') return action
      if (!action.characterKey) return action
      const compositeKey = `${action.characterKey}:${action.iconKey}`
      const newIconKey = mappings[compositeKey]
      if (!newIconKey) return action
      return { ...action, iconKey: newIconKey }
    })

    return { ...actionSet, postActions: newPostActions }
  }

  return {
    extractCharacterKeys,
    countCharacterUsage,
    applyCharacterMappings,
    isInvalidIconKey,
    extractInvalidIconKeyPairs,
    countIconKeyUsage,
    applyIconKeyMappings,
  }
}
