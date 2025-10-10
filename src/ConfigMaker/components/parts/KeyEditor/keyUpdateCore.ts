// src\ConfigMaker\components\parts\useKeyEditor\keyUpdateCore.ts
import { RecordCategoryType } from '@/types/OmikujiData/CategoryType'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

/**
 * 汎用ルールKey更新処理（BaseRecordSchema対応）
 */
export function updateRecordKey(category: RecordCategoryType, oldKey: string, newKey: string): boolean {
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
export function updateCharacterKey(oldKey: string, newKey: string): boolean {
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
export function updatePlaceholderKey(oldKey: string, newKey: string): boolean {
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
