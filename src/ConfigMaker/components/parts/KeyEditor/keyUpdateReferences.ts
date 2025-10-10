// src\ConfigMaker\components\parts\useKeyEditor\keyUpdateReferences.ts
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

/**
 * キャラクター参照の更新
 * PostActionArraySchemaを持つ全カテゴリ（comments, timers, actionSets）から参照を更新
 */
export function updateCharacterReferences(oldKey: string, newKey: string): void {
  const omikujiStore = useOmikujiStore()

  // comments, timers内のpostActionsから参照を更新
  ;(['comments', 'timers'] as const).forEach((category) => {
    const categoryData = omikujiStore.getCategoryMap(category)

    Object.entries(categoryData).forEach(([ruleKey, rule]) => {
      const updatedOmikuji = rule.omikuji.map((omikujiSet) => ({
        ...omikujiSet,
        postActions: omikujiSet.postActions.map((action) =>
          action.characterKey === oldKey ? { ...action, characterKey: newKey } : action
        ),
      }))

      omikujiStore.updateItem(category, ruleKey, { ...rule, omikuji: updatedOmikuji })
    })
  })

  // actionSets内のcharacterKey参照を更新
  const actionSets = omikujiStore.getCategoryMap('actionSets')
  Object.entries(actionSets).forEach(([actionSetKey, actionSet]) => {
    const updatedPostActions = actionSet.postActions.map((action) =>
      action.characterKey === oldKey ? { ...action, characterKey: newKey } : action
    )

    omikujiStore.updateItem('actionSets', actionSetKey, {
      ...actionSet,
      postActions: updatedPostActions,
    })
  })
}

/**
 * プレースホルダー参照の更新
 * PostActionArraySchemaを持つ全カテゴリ（comments, timers, actionSets）から参照を更新
 */
export function updatePlaceholderReferences(oldKey: string, newKey: string): void {
  const omikujiStore = useOmikujiStore()
  const oldPlaceholder = `<<${oldKey}>>`
  const newPlaceholder = `<<${newKey}>>`
  const regex = new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')

  // プレースホルダー内容の更新
  const placeholders = omikujiStore.getCategoryMap('placeholders')
  Object.entries(placeholders).forEach(([key, placeholder]) => {
    const updatedValues = placeholder.values.map((value: any) => {
      const v = typeof value === 'string' ? { content: value, weight: 1 } : value
      return v.content.includes(oldPlaceholder) ? { ...v, content: v.content.replace(regex, newPlaceholder) } : v
    })
    omikujiStore.updateItem('placeholders', key, { ...placeholder, values: updatedValues })
  })

  // ルール内のメッセージ参照更新（comments, timers）
  type EditableActionFields = 'messageContent' | 'messageToast' | 'wordParty'
  ;(['comments', 'timers'] as const).forEach((category) => {
    const categoryData = omikujiStore.getCategoryMap(category)

    Object.entries(categoryData).forEach(([ruleKey, rule]) => {
      const updatedOmikuji = rule.omikuji.map((omikujiSet) => ({
        ...omikujiSet,
        postActions: omikujiSet.postActions.map((action) => {
          const newAction = { ...action }

          ;(['messageContent', 'messageToast', 'wordParty'] as EditableActionFields[]).forEach((field) => {
            const value = newAction[field]
            if (value?.includes(oldPlaceholder)) newAction[field] = value.replace(regex, newPlaceholder)
          })
          return newAction
        }),
      }))

      omikujiStore.updateItem(category, ruleKey, { ...rule, omikuji: updatedOmikuji })
    })
  })

  // actionSets内のメッセージ参照更新
  const actionSets = omikujiStore.getCategoryMap('actionSets')
  Object.entries(actionSets).forEach(([actionSetKey, actionSet]) => {
    const updatedPostActions = actionSet.postActions.map((action) => {
      const newAction = { ...action }

      ;(['messageContent', 'messageToast', 'wordParty'] as EditableActionFields[]).forEach((field) => {
        const value = newAction[field]
        if (value?.includes(oldPlaceholder)) newAction[field] = value.replace(regex, newPlaceholder)
      })
      return newAction
    })

    omikujiStore.updateItem('actionSets', actionSetKey, {
      ...actionSet,
      postActions: updatedPostActions,
    })
  })
}

/**
 * actionSet参照の更新
 * comments/timersのpostActionsから actionSetKey を更新
 * actionSets自身の回帰参照（actionSets内のpostActionsのactionSetKey）も更新
 */
export function updateActionSetReferences(oldKey: string, newKey: string): void {
  const omikujiStore = useOmikujiStore()

  // comments, timersからの参照を更新
  ;(['comments', 'timers'] as const).forEach((category) => {
    const categoryData = omikujiStore.getCategoryMap(category)

    Object.entries(categoryData).forEach(([ruleKey, rule]) => {
      const updatedOmikuji = rule.omikuji.map((omikujiSet) => ({
        ...omikujiSet,
        postActions: omikujiSet.postActions.map((action) =>
          action.actionSetKey === oldKey ? { ...action, actionSetKey: newKey } : action
        ),
      }))

      omikujiStore.updateItem(category, ruleKey, { ...rule, omikuji: updatedOmikuji })
    })
  })

  // actionSets自身の回帰参照を更新
  const actionSets = omikujiStore.getCategoryMap('actionSets')
  Object.entries(actionSets).forEach(([actionSetKey, actionSet]) => {
    const updatedPostActions = actionSet.postActions.map((action) =>
      action.actionSetKey === oldKey ? { ...action, actionSetKey: newKey } : action
    )

    omikujiStore.updateItem('actionSets', actionSetKey, {
      ...actionSet,
      postActions: updatedPostActions,
    })
  })
}
