// src/ConfigMaker/script/stores/composables/useRecordCRUD.ts
import { Ref } from 'vue'
import {
  CategoryType,
  RecordCategorySchemaMap,
  RecordCategoryType,
  RecordCategoryItemTypeMap,
} from '@/types/OmikujiData/CategoryType'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'

/**
 * レコード型カテゴリの基本的なCRUD操作を提供
 */
export function useRecordCRUD(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  // カテゴリデータ更新
  const updateCategoryData = <C extends CategoryType>(category: C, newData: OmikujiDataType[C]) => {
    data.value[category] = newData
    hasChanged.value = true
  }

  // アイテム追加
  const addItem = <C extends RecordCategoryType>(
    category: C,
    item: Partial<RecordCategoryItemTypeMap[C]> = {}
  ): string => {
    const schema = RecordCategorySchemaMap[category]
    const parseItem = { ...item }

    // keyの重複チェック
    if (typeof parseItem.key === 'string' && data.value[category][parseItem.key]) {
      delete parseItem.key
    }

    // idとkeyの補完（現行仕様では同一にする）
    if (!parseItem.id && !parseItem.key) {
      const unique = String(Date.now())
      parseItem.id = unique
      parseItem.key = unique
    } else if (!parseItem.id && parseItem.key) {
      parseItem.id = parseItem.key
    } else if (!parseItem.key && parseItem.id) {
      parseItem.key = parseItem.id
    }

    // order値を自動設定
    const existingItems = Object.values(data.value[category])
    const maxOrder = Math.max(0, ...existingItems.map((item) => item.order ?? 0))
    parseItem.order = maxOrder + 1
    parseItem.isEnabled = true
    parseItem.id = parseItem.key ?? undefined // TODO:v2.0で削除予定。idはkeyと切り離し、一意性専用にする

    const newItem = schema.parse(parseItem) as RecordCategoryItemTypeMap[C]

    data.value[category] = { ...data.value[category], [newItem.key]: newItem }
    hasChanged.value = true
    return newItem.key
  }

  // アイテム更新
  const updateItem = <C extends RecordCategoryType>(
    category: C,
    key: string,
    updates: Partial<RecordCategoryItemTypeMap[C]>
  ) => {
    const categoryData = data.value[category] as Record<string, RecordCategoryItemTypeMap[C]>

    if (categoryData?.[key]) {
      const updatedItem = {
        ...categoryData[key],
        ...updates,
        key: key, // keyは変更不可
        updatedAt: new Date().toISOString(),
      }
      data.value[category] = {
        ...categoryData,
        [key]: updatedItem,
      } as any
      hasChanged.value = true
    }
  }

  // アイテム削除
  const removeItem = (category: RecordCategoryType, key: string) => {
    const categoryData = data.value[category] as Record<string, any>

    if (categoryData?.[key]) {
      const { [key]: deleted, ...remaining } = categoryData
      updateCategoryData(category, remaining as any)
    }
  }

  // アイテム複製
  const duplicateItem = <C extends RecordCategoryType>(category: C, key: string): string | null => {
    const categoryData = data.value[category] as Record<string, RecordCategoryItemTypeMap[C]>
    const item = categoryData?.[key]
    if (!item) return null

    const timestamp = new Date().toISOString()
    const duplicatedItem = {
      ...item,
      key: `${key.replace(/_copy_\d+$/, '')}_copy_${Date.now()}`,
      name: `${item.name} (コピー)`,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    return addItem(category, duplicatedItem)
  }

  // Key変更
  /**
   * Keyを変更する専用関数
   * 注意: 他のアイテムからの参照更新は keyUpdateStrategies を使用すること
   */
  const updateItemKey = <C extends RecordCategoryType>(category: C, oldKey: string, newKey: string): boolean => {
    const categoryData = data.value[category] as Record<string, RecordCategoryItemTypeMap[C]>

    if (!categoryData?.[oldKey] || categoryData?.[newKey]) {
      return false // 旧keyが存在しない、または新keyが既に存在
    }

    const item = categoryData[oldKey]
    const { [oldKey]: removed, ...remaining } = categoryData

    const updatedItem = {
      ...item,
      key: newKey,
      updatedAt: new Date().toISOString(),
    }

    data.value[category] = {
      ...remaining,
      [newKey]: updatedItem,
    } as any

    hasChanged.value = true
    return true
  }

  return {
    updateCategoryData,
    addItem,
    updateItem,
    removeItem,
    duplicateItem,
    updateItemKey,
  }
}
