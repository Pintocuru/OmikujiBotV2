// src/ConfigMaker/script/stores/composables/useRecordOperations.ts
import { nextTick, Ref } from 'vue'
import {
  categorySchemaMap,
  CategoryType,
  OmikujiDataType,
  PlaceholderValuesSchema,
  PlaceholderValueType,
  RecordCategoryType,
  RecordCategoryTypeMap,
} from '@/types/'

// categorySchemaMapの型安全性を向上
interface TypedSchema<T> {
  parse(input: unknown): T & { id: string }
}
const typedCategorySchemaMap: {
  [K in RecordCategoryType]: TypedSchema<RecordCategoryTypeMap[K]>
} = categorySchemaMap as any

/**
 * カテゴリ内のアイテム操作機能を提供するコンポーザブル
 */
export function useRecordOperations(data: Ref<OmikujiDataType>) {
  /**
   * カテゴリ全体のデータを更新
   */
  const updateCategoryData = <C extends CategoryType>(category: C, newData: OmikujiDataType[C]) => {
    data.value[category] = newData
  }

  /**
   * カテゴリに新しいアイテムを追加
   */
  const addItem = <C extends RecordCategoryType>(category: C, item: Partial<RecordCategoryTypeMap[C]> = {}) => {
    const schema = typedCategorySchemaMap[category]
    let parseItem = item

    // 重複check
    if (typeof parseItem.id === 'string' && data.value[category][parseItem.id]) {
      parseItem = { ...parseItem, id: undefined }
    }

    const newItem = schema.parse(parseItem)
    const id = newItem.id

    data.value[category] = { ...data.value[category], [id]: newItem }
  }

  /**
   * カテゴリ内のアイテムを更新（存在しない場合は追加）
   */
  const updateItem = <C extends RecordCategoryType>(
    category: C,
    id: string,
    updates: Partial<RecordCategoryTypeMap[C]>
  ) => {
    const categoryData = data.value[category] as Record<string, RecordCategoryTypeMap[C]>

    if (categoryData && categoryData[id] !== undefined) {
      const updatedItem = { ...categoryData[id], ...updates, updatedAt: new Date().toISOString() }
      const updatedCategory = { ...categoryData, [id]: updatedItem }
      data.value[category] = updatedCategory as any
    } else {
      addItem(category, updates)
    }
  }

  /**
   * RecordCategoryのプロパティを更新
   */
  const updateRecordProperty = <C extends RecordCategoryType, K extends keyof OmikujiDataType[C][string]>(
    category: C,
    id: string,
    key: K,
    value: OmikujiDataType[C][string][K]
  ) => {
    const currentCategory = data.value[category] as OmikujiDataType[C]

    if (currentCategory && currentCategory[id]) {
      const updatedItem = {
        ...currentCategory[id],
        [key]: value,
        updatedAt: new Date().toISOString(),
      }
      const updatedCategory = {
        ...currentCategory,
        [id]: updatedItem,
      } as OmikujiDataType[C]

      updateCategoryData(category, updatedCategory)
    }
  }

  /**
   * Placeholder専用の更新
   */
  const updatePlaceholderValues = (placeholderId: string, rawValues: Array<PlaceholderValueType | string>) => {
    if (data.value.placeholders[placeholderId]) {
      // Zodスキーマで値をパースし、同時に最適化された値を取得
      const parsedAndOptimizedValues = PlaceholderValuesSchema.parse(rawValues)

      // 汎用的な更新関数を使って、最適化された値を設定
      updateRecordProperty('placeholders', placeholderId, 'values', parsedAndOptimizedValues)
    }
  }

  /**
   * カテゴリからアイテムを削除
   */
  const removeItem = (category: RecordCategoryType, id: string) => {
    const categoryData = data.value[category] as Record<string, OmikujiDataType[typeof category][string]>

    if (categoryData && categoryData[id] !== undefined) {
      const updatedCategory = Object.fromEntries(
        Object.entries(categoryData).filter(([key]) => key !== id)
      ) as OmikujiDataType[typeof category]

      updateCategoryData(category, updatedCategory)
    }
  }

  /**
   * カテゴリ内のアイテムを複製
   */
  const duplicateItem = <C extends RecordCategoryType>(category: C, id: string): string | null => {
    const item = getItem<RecordCategoryTypeMap[C]>(category, id)
    if (!item) return null

    const newId = `${id}_copy`
    const now = new Date().toISOString()
    const duplicatedItem = { ...item, id: newId, createdAt: now, updatedAt: now }

    addItem(category, duplicatedItem)
    return newId
  }

  /**
   * カテゴリから特定のアイテムを取得
   */
  const getItem = <T>(category: RecordCategoryType, id: string): T | undefined => {
    return (data.value[category] as Record<string, T>)?.[id]
  }

  /**
   * カテゴリの全アイテムを取得
   */
  const getCategoryMap = <K extends RecordCategoryType>(category: K): Record<string, RecordCategoryTypeMap[K]> => {
    return (data.value[category] as Record<string, RecordCategoryTypeMap[K]>) || {}
  }

  /**
   * カテゴリのアイテム配列を取得
   */
  const getCategoryArray = <K extends RecordCategoryType>(category: K): RecordCategoryTypeMap[K][] => {
    return Object.values(data.value[category]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  /**
   * カテゴリ内のアイテム順序(order)を移動
   */
  const reorderItem = async <K extends RecordCategoryType>(category: K, fromIndex: number, toIndex: number) => {
    const rulesArray = getCategoryArray(category)

    const ids = rulesArray.map((rule) => rule.id)
    const [movedId] = ids.splice(fromIndex, 1)
    ids.splice(toIndex, 0, movedId)

    const updatedRules: Record<string, RecordCategoryTypeMap[K]> = {}
    ids.forEach((id, index) => {
      const item = getItem<RecordCategoryTypeMap[K]>(category, id)
      if (item) {
        updatedRules[id] = { ...item, order: index + 1 }
      }
    })

    await nextTick()
    updateCategoryData(category as CategoryType, updatedRules)
  }

  return {
    updateCategoryData,
    addItem,
    updateItem,
    removeItem,
    duplicateItem,
    updateRecordProperty,
    updatePlaceholderValues,
    getItem,
    getCategoryMap,
    getCategoryArray,
    reorderItem,
  }
}
