// src/ConfigMaker/script/stores/composables/useRecordOperations.ts
import { nextTick, Ref } from 'vue'
import {
  CategoryType,
  RecordCategorySchemaMap,
  RecordCategoryType,
  RecordCategoryItemTypeMap,
} from '@/types/OmikujiData/CategoryType'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { PlaceholderValuesSchema, PlaceholderValueType } from '@/types/OmikujiData/PlaceholderSchema'
import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'

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
  const addItem = <C extends RecordCategoryType>(
    category: C,
    item: Partial<RecordCategoryItemTypeMap[C]> = {}
  ): string => {
    const schema = RecordCategorySchemaMap[category]
    let parseItem = item

    if (typeof parseItem.id === 'string' && data.value[category][parseItem.id]) {
      parseItem = { ...parseItem, id: undefined }
    }
    // orderはこの関数で管理する
    const newOrder = getCategoryArray(category).length + 1
    parseItem.order = newOrder

    const newItem = schema.parse(parseItem) as RecordCategoryItemTypeMap[C]
    const id = newItem.id

    data.value[category] = { ...data.value[category], [id]: newItem }

    return id
  }

  /**
   * カテゴリ内のアイテムを更新（存在しない場合は追加）
   */
  const updateItem = <C extends RecordCategoryType>(
    category: C,
    id: string,
    updates: Partial<RecordCategoryItemTypeMap[C]>
  ) => {
    const categoryData = data.value[category] as Record<string, RecordCategoryItemTypeMap[C]>

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
   * omikuji.PostActions専用の更新
   */
  const updateOmikujiPostActions = (
    category: RulesCategoryType,
    ruleId: string,
    omikujiIndex: number,
    postActions: PostActionType[]
  ) => {
    const record = getItem(category, ruleId) as RuleType
    if (!record || !record.omikuji || !record.omikuji[omikujiIndex]) {
      console.error('指定されたおみくじが見つかりません')
      return
    }

    // 指定されたインデックスのpostActionsを更新
    const updatedOmikuji = [...record.omikuji]
    const sortedPostActions = postActions.sort((a, b) => a.delaySeconds - b.delaySeconds)
    updatedOmikuji[omikujiIndex] = {
      ...updatedOmikuji[omikujiIndex],
      postActions: sortedPostActions,
    }

    // updateRecordPropertyを使用して更新
    updateRecordProperty(category, ruleId, 'omikuji', updatedOmikuji)
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
   * selectedRuleIdが削除される場合は、適切な代替アイテムを選択する
   */
  const removeItem = (
    category: RecordCategoryType,
    id: string,
    selectRule?: (id: string) => void,
    clearSelection?: () => void,
    selectedRuleId?: string | null
  ) => {
    const categoryData = data.value[category] as Record<string, OmikujiDataType[typeof category][string]>

    if (categoryData && categoryData[id] !== undefined) {
      const isSelectedItem = selectedRuleId === id

      // 削除前に代替選択肢を準備
      let alternativeId: string | null = null

      if (isSelectedItem && selectRule) {
        // 現在のアイテムのorder値を取得
        const currentOrder = categoryData[id]?.order ?? 0

        // order順でソートされたアイテム配列を取得
        const sortedItems = Object.entries(categoryData)
          .filter(([key]) => key !== id) // 削除対象を除外
          .map(([key, item]) => ({ id: key, order: item.order ?? 0 }))
          .sort((a, b) => a.order - b.order)

        if (sortedItems.length > 0) {
          // 1. 削除するアイテムより1つ小さいorder値のアイテムを探す
          const previousItem = sortedItems.reverse().find((item) => item.order < currentOrder)

          if (previousItem) {
            alternativeId = previousItem.id
          } else {
            // 2. 前のアイテムがない場合は、最初のアイテムを選択
            alternativeId = sortedItems[sortedItems.length - 1]?.id || null
          }
        }
      }

      // アイテムを削除
      const updatedCategory = Object.fromEntries(
        Object.entries(categoryData).filter(([key]) => key !== id)
      ) as OmikujiDataType[typeof category]

      updateCategoryData(category, updatedCategory)

      // 選択されているアイテムが削除された場合の処理
      if (isSelectedItem) {
        if (alternativeId && selectRule) {
          selectRule(alternativeId)
        } else if (clearSelection) {
          clearSelection()
        }
      }
    }
  }

  /**
   * カテゴリ内のアイテムを複製
   */
  const duplicateItem = <C extends RecordCategoryType>(category: C, id: string): string | null => {
    const item = getItem<RecordCategoryItemTypeMap[C]>(category, id)
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
  const getCategoryMap = <K extends RecordCategoryType>(category: K): Record<string, RecordCategoryItemTypeMap[K]> => {
    return (data.value[category] as Record<string, RecordCategoryItemTypeMap[K]>) || {}
  }

  /**
   * カテゴリのアイテム配列を取得
   */
  const getCategoryArray = <K extends RecordCategoryType>(category: K): RecordCategoryItemTypeMap[K][] => {
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

    const updatedRules: Record<string, RecordCategoryItemTypeMap[K]> = {}
    ids.forEach((id, index) => {
      const item = getItem<RecordCategoryItemTypeMap[K]>(category, id)
      if (item) {
        updatedRules[id] = { ...item, order: index + 1 }
      }
    })

    await nextTick()
    updateCategoryData(category as CategoryType, updatedRules)
  }

  /**
   * draggable で移動の際に不具合があるため追加
   */
  const batchUpdateOrder = async <K extends RecordCategoryType>(
    category: K,
    updates: Array<{ id: string; newOrder: number }>
  ) => {
    const rulesArray = getCategoryArray(category)
    const updatedRules: Record<string, RecordCategoryItemTypeMap[K]> = {}

    // 既存のルールをコピー
    rulesArray.forEach((rule) => {
      updatedRules[rule.id] = { ...rule }
    })

    // order値を一括更新
    updates.forEach(({ id, newOrder }) => {
      if (updatedRules[id]) {
        updatedRules[id] = { ...updatedRules[id], order: newOrder }
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
    updateOmikujiPostActions,
    updatePlaceholderValues,
    getItem,
    getCategoryMap,
    getCategoryArray,
    reorderItem,
    batchUpdateOrder,
  }
}
