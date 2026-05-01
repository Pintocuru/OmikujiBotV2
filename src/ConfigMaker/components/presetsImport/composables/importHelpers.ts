// src/ConfigMaker/components/presetsImport/composables/importHelpers.ts
import { OmikujiDataType, RecordCategoryType, recordCategoryLabel, RecordCategoryDataMap } from '@/types/OmikujiData/'
import { UiKind } from '@/types'
import { CategoryImportConfig, ComponentImportConfig, ConflictInfo } from '../ImportTypes'

/**
 * アイテムの名前を取得
 */
export const getItemName = (item: any): string => {
  if (item && typeof item === 'object' && 'name' in item) {
    return item.name || ''
  }
  return ''
}

/**
 * レコードの競合をチェック
 */
export const checkRecordConflicts = (
  currentData: OmikujiDataType,
  importData: OmikujiDataType,
  category: RecordCategoryType
): ConflictInfo[] => {
  const currentItems = currentData[category] as RecordCategoryDataMap[typeof category]
  const importItems = importData[category] as RecordCategoryDataMap[typeof category]

  if (!currentItems || !importItems || typeof currentItems !== 'object' || typeof importItems !== 'object') {
    return []
  }

  const importKeys = Object.keys(importItems)
  const currentKeys = Object.keys(currentItems)
  const conflictKeys = importKeys.filter((key) => currentKeys.includes(key))

  return conflictKeys.map((key) => ({
    key,
    name: getItemName((importItems as any)[key]),
  }))
}

/**
 * カテゴリのプレビューを生成
 */
export const generateCategoryPreview = (currentData: OmikujiDataType, importData: OmikujiDataType) => {
  const recordCategories: Partial<Record<RecordCategoryType, CategoryImportConfig>> = {}
  let totalItems = 0

  recordCategoryLabel.forEach((category) => {
    const importItems = importData[category] as RecordCategoryDataMap[typeof category]
    const importCount = importItems ? Object.keys(importItems).length : 0
    const conflicts = checkRecordConflicts(currentData, importData, category)

    totalItems += importCount

    recordCategories[category] = {
      enabled: true,
      mode: 'partial-merge',
      count: importCount,
      conflicts,
    }
  })

  return {
    recordCategories: recordCategories as Record<RecordCategoryType, CategoryImportConfig>,
    totalItems,
  }
}

/**
 * アイテムのプレビューを生成
 */
export const generateComponentPreview = (
  currentData: OmikujiDataType,
  importData: OmikujiDataType
): Record<UiKind, ComponentImportConfig> => {
  const componentConfigs: Partial<Record<UiKind, ComponentImportConfig>> = {}
  const currentComponents = currentData.featureUsage.components || []
  const importComponents = importData.featureUsage.components || []

  currentComponents.forEach((compKey) => {
    if (importComponents.includes(compKey)) {
      const key = compKey as UiKind
      componentConfigs[key] = {
        enabled: true,
        useImported: false,
      }
    }
  })

  return componentConfigs as Record<UiKind, ComponentImportConfig>
}
