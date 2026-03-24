// src/ConfigMaker/components/KeyEditor/composables/keyUpdateReferences.ts
import type { PostFlowType } from '@/types/OmikujiData/'
import { eventCategoryLabel } from '@/types/OmikujiData/'
import { useGetRecordData } from '@config/stores/useGetRecordData'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'

/**
 * イベントカテゴリ（comments, timers）のpostActions更新
 */
function updateRuleCategoriesPostActions(updateFn: (action: PostFlowType) => PostFlowType): void {
  const { updateItem } = useOmikujiStore()
  const { getCategoryMap } = useGetRecordData()

  eventCategoryLabel.forEach((category) => {
    const categoryData = getCategoryMap(category)
    Object.entries(categoryData).forEach(([ruleKey, rule]) => {
      const updatedOmikuji = rule.omikuji.map((omikujiSet) => ({
        ...omikujiSet,
        postActions: omikujiSet.postActions.map(updateFn),
      }))
      updateItem(category, ruleKey, { ...rule, omikuji: updatedOmikuji })
    })
  })
}

/**
 * actionSetsカテゴリのpostActions更新
 */
function updateActionSetsPostActions(updateFn: (action: PostFlowType) => PostFlowType): void {
  const { updateItem } = useOmikujiStore()
  const { getCategoryMap } = useGetRecordData()
  const actionSets = getCategoryMap('actionSets')

  Object.entries(actionSets).forEach(([actionSetKey, actionSet]) => {
    const updatedPostActions = actionSet.postActions.map(updateFn)
    updateItem('actionSets', actionSetKey, {
      ...actionSet,
      postActions: updatedPostActions,
    })
  })
}

/**
 * キャラクター参照の更新
 */
export function updateCharacterReferences(oldKey: string, newKey: string): void {
  const updateFn = (action: PostFlowType): PostFlowType =>
    action.actionType === 'message' && action.characterKey === oldKey ? { ...action, characterKey: newKey } : action

  updateRuleCategoriesPostActions(updateFn)
  updateActionSetsPostActions(updateFn)
}

/**
 * プレースホルダー参照の更新
 */
export function updatePlaceholderReferences(oldKey: string, newKey: string): void {
  const { updateItem } = useOmikujiStore()
  const { getCategoryMap } = useGetRecordData()
  const oldPlaceholder = `<<${oldKey}>>`
  const newPlaceholder = `<<${newKey}>>`
  const regex = new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')

  // プレースホルダー内容の更新
  const placeholders = getCategoryMap('placeholders')
  Object.entries(placeholders).forEach(([key, placeholder]) => {
    const updatedValues = placeholder.values.map((value: any) => {
      const v = typeof value === 'string' ? { content: value, weight: 1 } : value
      return v.content.includes(oldPlaceholder) ? { ...v, content: v.content.replace(regex, newPlaceholder) } : v
    })
    updateItem('placeholders', key, { ...placeholder, values: updatedValues })
  })

  // postActions更新関数
  const updateFn = (action: PostFlowType): PostFlowType => {
    if (action.actionType === 'message') {
      const newMessage = { ...action.message }
      ;(['bubble'] as const).forEach((field) => {
        if (newMessage[field]?.includes(oldPlaceholder)) {
          newMessage[field] = newMessage[field]!.replace(regex, newPlaceholder)
        }
      })
      return { ...action, message: newMessage }
    }
    if (action.actionType === 'wordParty' && action.wordParty.includes(oldPlaceholder)) {
      return { ...action, wordParty: action.wordParty.replace(regex, newPlaceholder) }
    }
    return action
  }

  updateRuleCategoriesPostActions(updateFn)
  updateActionSetsPostActions(updateFn)
}

/**
 * actionSet参照の更新
 */
export function updateActionSetReferences(oldKey: string, newKey: string): void {
  const updateFn = (action: PostFlowType): PostFlowType => {
    if (action.actionType !== 'actionSet') return action

    const keys = Array.isArray(action.actionSetKeys) ? action.actionSetKeys : [action.actionSetKeys]

    if (!keys.some((k) => (typeof k === 'string' ? k : k.content) === oldKey)) {
      return action
    }

    return {
      ...action,
      actionSetKeys: keys.map((k) =>
        typeof k === 'string' ? (k === oldKey ? newKey : k) : k.content === oldKey ? { ...k, content: newKey } : k
      ),
    }
  }

  updateRuleCategoriesPostActions(updateFn)
  updateActionSetsPostActions(updateFn)
}
