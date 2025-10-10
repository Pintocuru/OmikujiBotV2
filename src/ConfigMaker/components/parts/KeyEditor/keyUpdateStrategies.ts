// src\ConfigMaker\components\parts\useKeyEditor\keyUpdateStrategies.ts
import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
import { RecordCategoryType } from '@/types/OmikujiData/CategoryType'
import { IdUpdateStrategy } from './keyEditorTypes'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

/**
 * 汎用ルールKey更新処理（BaseRecordSchema対応）
 */
function updateRecordKey(category: RecordCategoryType, oldKey: string, newKey: string): boolean {
  try {
    const omikujiStore = useOmikujiStore()
    const categoryMap = omikujiStore.getCategoryMap(category)
    const oldRecord = categoryMap[oldKey]

    if (!oldRecord || categoryMap[newKey]) return false

    // Key更新処理
    omikujiStore.addItem(category, { ...oldRecord, key: newKey })
    omikujiStore.removeItem(category, oldKey)
    omikujiStore.selectRule(newKey)

    return true
  } catch {
    return false
  }
}

/**
 * キャラクターKey更新
 */
function updateCharacterKey(oldKey: string, newKey: string): boolean {
  try {
    const omikujiStore = useOmikujiStore()
    const characters = omikujiStore.getCategoryMap('characters')
    const character = characters[oldKey]

    if (!character || characters[newKey]) return false

    omikujiStore.removeItem('characters', oldKey)
    omikujiStore.addItem('characters', { ...character, key: newKey })

    // 選択状態の更新
    if (omikujiStore.selectedCategory === 'characters' && omikujiStore.selectedRuleId === oldKey) {
      omikujiStore.selectRule(newKey)
    }

    return true
  } catch {
    return false
  }
}

/**
 * プレースホルダーKey更新
 */
function updatePlaceholderKey(oldKey: string, newKey: string): boolean {
  try {
    const omikujiStore = useOmikujiStore()
    const placeholders = omikujiStore.getCategoryMap('placeholders')
    const placeholder = placeholders[oldKey]

    if (!placeholder || placeholders[newKey]) return false

    const { key, ...placeholderData } = placeholder
    omikujiStore.addItem('placeholders', { ...placeholderData, key: newKey })
    omikujiStore.removeItem('placeholders', oldKey)

    if (omikujiStore.selectedRuleId === oldKey) {
      omikujiStore.selectRule(newKey)
    }

    return true
  } catch {
    return false
  }
}

/**
 * キャラクター参照の更新
 * PostActionArraySchemaを持つ全カテゴリ（comments, timers, actionSets）から参照を更新
 */
function updateCharacterReferences(oldKey: string, newKey: string): void {
  const omikujiStore = useOmikujiStore()

  // comments, timers内のpostActionsから参照を更新
  ;(['comments', 'timers'] as const).forEach((category) => {
    const categoryData = omikujiStore.getCategoryMap(category)

    Object.entries(categoryData).forEach(([ruleId, rule]) => {
      const updatedOmikuji = rule.omikuji.map((omikujiSet) => ({
        ...omikujiSet,
        postActions: omikujiSet.postActions.map((action) =>
          action.characterKey === oldKey ? { ...action, characterKey: newKey } : action
        ),
      }))

      omikujiStore.updateItem(category, ruleId, { ...rule, omikuji: updatedOmikuji })
    })
  })

  // actionSets内のcharacterKey参照を更新
  const actionSets = omikujiStore.getCategoryMap('actionSets')
  Object.entries(actionSets).forEach(([actionSetId, actionSet]) => {
    const updatedPostActions = actionSet.postActions.map((action) =>
      action.characterKey === oldKey ? { ...action, characterKey: newKey } : action
    )

    omikujiStore.updateItem('actionSets', actionSetId, {
      ...actionSet,
      postActions: updatedPostActions,
    })
  })
}

/**
 * プレースホルダー参照の更新
 * PostActionArraySchemaを持つ全カテゴリ（comments, timers, actionSets）から参照を更新
 */
function updatePlaceholderReferences(oldKey: string, newKey: string): void {
  const omikujiStore = useOmikujiStore()
  const oldPlaceholder = `<<${oldKey}>>`
  const newPlaceholder = `<<${newKey}>>`
  const regex = new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')

  // プレースホルダー内容の更新
  const placeholders = omikujiStore.getCategoryMap('placeholders')
  Object.entries(placeholders).forEach(([id, placeholder]) => {
    const updatedValues = placeholder.values.map((value: any) => {
      const v = typeof value === 'string' ? { content: value, weight: 1 } : value
      return v.content.includes(oldPlaceholder) ? { ...v, content: v.content.replace(regex, newPlaceholder) } : v
    })
    omikujiStore.updateItem('placeholders', id, { ...placeholder, values: updatedValues })
  })

  // ルール内のメッセージ参照更新（comments, timers）
  type EditableActionFields = 'messageContent' | 'messageToast' | 'wordParty'
  ;(['comments', 'timers'] as const).forEach((category) => {
    const categoryData = omikujiStore.getCategoryMap(category)

    Object.entries(categoryData).forEach(([ruleId, rule]) => {
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

      omikujiStore.updateItem(category, ruleId, { ...rule, omikuji: updatedOmikuji })
    })
  })

  // actionSets内のメッセージ参照更新
  const actionSets = omikujiStore.getCategoryMap('actionSets')
  Object.entries(actionSets).forEach(([actionSetId, actionSet]) => {
    const updatedPostActions = actionSet.postActions.map((action) => {
      const newAction = { ...action }

      ;(['messageContent', 'messageToast', 'wordParty'] as EditableActionFields[]).forEach((field) => {
        const value = newAction[field]
        if (value?.includes(oldPlaceholder)) newAction[field] = value.replace(regex, newPlaceholder)
      })
      return newAction
    })

    omikujiStore.updateItem('actionSets', actionSetId, {
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
function updateActionSetReferences(oldKey: string, newKey: string): void {
  const omikujiStore = useOmikujiStore()

  // comments, timersからの参照を更新
  ;(['comments', 'timers'] as const).forEach((category) => {
    const categoryData = omikujiStore.getCategoryMap(category)

    Object.entries(categoryData).forEach(([ruleId, rule]) => {
      const updatedOmikuji = rule.omikuji.map((omikujiSet) => ({
        ...omikujiSet,
        postActions: omikujiSet.postActions.map((action) =>
          action.actionSetKey === oldKey ? { ...action, actionSetKey: newKey } : action
        ),
      }))

      omikujiStore.updateItem(category, ruleId, { ...rule, omikuji: updatedOmikuji })
    })
  })

  // actionSets自身の回帰参照を更新
  const actionSets = omikujiStore.getCategoryMap('actionSets')
  Object.entries(actionSets).forEach(([actionSetId, actionSet]) => {
    const updatedPostActions = actionSet.postActions.map((action) =>
      action.actionSetKey === oldKey ? { ...action, actionSetKey: newKey } : action
    )

    omikujiStore.updateItem('actionSets', actionSetId, {
      ...actionSet,
      postActions: updatedPostActions,
    })
  })
}

/**
 * Key更新戦略マップ
 * すべてのRecordCategoryTypeに対応（BaseRecordSchema準拠）
 */
export const updateStrategies: Record<RecordCategoryType, IdUpdateStrategy<RecordCategoryType>> = {
  characters: {
    updateId: updateCharacterKey,
    updateReferences: updateCharacterReferences,
  },
  placeholders: {
    updateId: updatePlaceholderKey,
    updateReferences: updatePlaceholderReferences,
  },
  actionSets: {
    updateId: (oldKey, newKey) => updateRecordKey('actionSets', oldKey, newKey),
    updateReferences: updateActionSetReferences,
  },
  comments: {
    updateId: (oldKey, newKey) => updateRecordKey('comments', oldKey, newKey),
  },
  timers: {
    updateId: (oldKey, newKey) => updateRecordKey('timers', oldKey, newKey),
  },
}
