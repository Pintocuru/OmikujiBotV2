// src/configMaker/components/parts/strategies/idUpdateStrategies.ts
import { RecordCategoryType } from '@/types/'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
import { IdUpdateStrategy } from './idEditorTypes'

/**
 * 汎用ルールID更新処理
 */
function updateRuleId(category: 'comments' | 'timers', oldId: string, newId: string): boolean {
  try {
    const omikujiStore = useOmikujiStore()
    const categoryMap = omikujiStore.getCategoryMap(category)
    const oldRule = categoryMap[oldId]

    if (!oldRule || categoryMap[newId]) return false

    // ID更新処理
    omikujiStore.addItem(category, { ...oldRule, id: newId })
    omikujiStore.removeItem(category, oldId)
    omikujiStore.selectRule(newId)

    return true
  } catch {
    return false
  }
}

/**
 * キャラクターID更新
 */
function updateCharacterId(oldId: string, newId: string): boolean {
  try {
    const omikujiStore = useOmikujiStore()
    const characters = omikujiStore.getCategoryMap('characters')
    const character = characters[oldId]

    if (!character || characters[newId]) return false

    omikujiStore.removeItem('characters', oldId)
    omikujiStore.addItem('characters', { ...character, id: newId })

    // 選択状態の更新
    if (omikujiStore.selectedCategory === 'characters' && omikujiStore.selectedRuleId === oldId) {
      omikujiStore.selectRule(newId)
    }

    return true
  } catch {
    return false
  }
}

/**
 * プレースホルダーID更新
 */
function updatePlaceholderId(oldId: string, newId: string): boolean {
  try {
    const omikujiStore = useOmikujiStore()
    const placeholders = omikujiStore.getCategoryMap('placeholders')
    const placeholder = placeholders[oldId]

    if (!placeholder || placeholders[newId]) return false

    const { id, ...placeholderData } = placeholder
    omikujiStore.addItem('placeholders', { ...placeholderData, id: newId })
    omikujiStore.removeItem('placeholders', oldId)

    if (omikujiStore.selectedRuleId === oldId) {
      omikujiStore.selectRule(newId)
    }

    return true
  } catch {
    return false
  }
}

/**
 * キャラクター参照の更新
 */
function updateCharacterReferences(oldId: string, newId: string): void {
  const omikujiStore = useOmikujiStore()

  ;(['comments', 'timers'] as const).forEach((category) => {
    const categoryData = omikujiStore.getCategoryMap(category)

    Object.entries(categoryData).forEach(([ruleId, rule]) => {
      const updatedOmikuji = rule.omikuji.map((omikujiSet) => ({
        ...omikujiSet,
        postActions: omikujiSet.postActions.map((action) =>
          action.characterKey === oldId ? { ...action, characterKey: newId } : action
        ),
      }))

      omikujiStore.updateItem(category, ruleId, { ...rule, omikuji: updatedOmikuji })
    })
  })
}

/**
 * プレースホルダー参照の更新
 */
function updatePlaceholderReferences(oldId: string, newId: string): void {
  const omikujiStore = useOmikujiStore()
  const oldPlaceholder = `<<${oldId}>>`
  const newPlaceholder = `<<${newId}>>`
  const regex = new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')

  // プレースホルダー内容の更新
  const placeholders = omikujiStore.getCategoryMap('placeholders')
  Object.entries(placeholders).forEach(([id, placeholder]) => {
    const updatedValues = (placeholder as any).values.map((value: any) =>
      value.content.includes(oldPlaceholder)
        ? { ...value, content: value.content.replace(regex, newPlaceholder) }
        : value
    )
    omikujiStore.updateItem('placeholders', id, { ...placeholder, values: updatedValues })
  })

  // ルール内のメッセージ参照更新
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
}

/**
 * ID更新戦略マップ
 */
export const updateStrategies: Record<RecordCategoryType, IdUpdateStrategy<RecordCategoryType>> = {
  characters: {
    updateId: updateCharacterId,
    updateReferences: updateCharacterReferences,
  },
  placeholders: {
    updateId: updatePlaceholderId,
    updateReferences: updatePlaceholderReferences,
  },
  comments: {
    updateId: (oldId, newId) => updateRuleId('comments', oldId, newId),
  },
  timers: {
    updateId: (oldId, newId) => updateRuleId('timers', oldId, newId),
  },
}
