// src/ConfigMaker/stores/composables/useRecordCRUD.ts
import { Ref } from 'vue'
import {
  RecordCategorySchemaMap,
  RecordCategoryType,
  RecordCategoryItemTypeMap,
  recordCategoryLabel,
} from '@/types/OmikujiData/'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'

/**
 * レコード型カテゴリの基本的なCRUD操作を提供
 */
export function useRecordCRUD(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
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

    // order値を自動設定
    const existingItems = Object.values(data.value[category])
    const maxOrder = Math.max(0, ...existingItems.map((item) => item.order ?? 0))
    parseItem.order = maxOrder + 1
    parseItem.isEnabled = true

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
      const { [key]: _deleted, ...remaining } = categoryData
      updateCategoryData(category, remaining as any)
    }
  }

  // カテゴリデータ更新
  const updateCategoryData = (category: RecordCategoryType, newData: Record<string, any>) => {
    if (!recordCategoryLabel.includes(category)) {
      console.warn(`Invalid category: ${category}`)
      return
    }

    data.value[category] = newData
    hasChanged.value = true
  }

  // アイテム複製
  const duplicateItem = <C extends RecordCategoryType>(category: C, key: string): string | null => {
    const categoryData = data.value[category] as Record<string, RecordCategoryItemTypeMap[C]>
    const item = categoryData?.[key]
    if (!item) return null

    const timestamp = new Date().toISOString()
    const duplicatedItem = {
      ...item,
      id: undefined,
      key: `${key.replace(/_copy_\d+$/, '')}_copy_${Date.now()}`,
      name: `${item.name}(コピー)`,
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
    const { [oldKey]: _removed, ...remaining } = categoryData

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

  /**
   * カテゴリーの全削除
   */
  const clearCategory = (category: RecordCategoryType) => {
    data.value[category] = {} as any
    hasChanged.value = true
  }

  /**
   * ドラッグ並び替え専用: order を一括書き込み（Pinia 変更通知を1回に集約）
   *
   * updateItem をループで呼ぶと1件ごとに Pinia が変更通知を発火し、
   * watch が複数回走って draggableItems が意図しないタイミングで再構築される。
   * このメソッドはカテゴリ全体を1回のオブジェクト代入で更新することで
   * 通知を1回に抑え、order の書き込み競合を防ぐ。
   *
   * @param category 対象カテゴリ
   * @param orderedKeys ドラッグ後の正しい順序のキー配列
   */
  const reorderItems = (category: RecordCategoryType, orderedKeys: string[]): void => {
    const categoryData = data.value[category] as Record<string, RecordCategoryItemTypeMap[typeof category]>
    const timestamp = new Date().toISOString()

    const reordered = { ...categoryData }

    for (let i = 0; i < orderedKeys.length; i++) {
      const key = orderedKeys[i]
      if (!reordered[key]) continue
      reordered[key] = {
        ...reordered[key],
        order: i,
        updatedAt: timestamp,
      }
    }

    data.value[category] = reordered as any
    hasChanged.value = true
  }

  return {
    addItem,
    updateItem,
    removeItem,
    duplicateItem,
    updateItemKey,
    clearCategory,
    reorderItems,
  }
}
