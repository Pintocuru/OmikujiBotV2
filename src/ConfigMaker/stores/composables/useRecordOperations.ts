// src/ConfigMaker/script/stores/composables/useRecordOperations.ts (純粋データ操作のみ - 簡素化)
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
 * 純粋なデータ操作のみ（UI状態管理なし）
 */
export function useRecordOperations(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  const updateCategoryData = <C extends CategoryType>(category: C, newData: OmikujiDataType[C]) => {
    data.value[category] = newData
    hasChanged.value = true
  }

  const addItem = <C extends RecordCategoryType>(
    category: C,
    item: Partial<RecordCategoryItemTypeMap[C]> = {}
  ): string => {
    const schema = RecordCategorySchemaMap[category]
    const parseItem = { ...item }

    // IDの重複チェック
    if (typeof parseItem.id === 'string' && data.value[category][parseItem.id]) {
      delete parseItem.id
    }

    // order値を自動設定
    const existingItems = Object.values(data.value[category])
    const maxOrder = Math.max(0, ...existingItems.map((item) => item.order ?? 0))
    parseItem.order = maxOrder + 1
    parseItem.isEnabled = true // optionalなのでtrueはここで入れる

    const newItem = schema.parse(parseItem) as RecordCategoryItemTypeMap[C]
    const id = newItem.id

    data.value[category] = { ...data.value[category], [id]: newItem }
    hasChanged.value = true
    return id
  }

  const updateItem = <C extends RecordCategoryType>(
    category: C,
    id: string,
    updates: Partial<RecordCategoryItemTypeMap[C]>
  ) => {
    const categoryData = data.value[category] as Record<string, RecordCategoryItemTypeMap[C]>

    if (categoryData?.[id]) {
      const updatedItem = {
        ...categoryData[id],
        ...updates,
        key: id, // FIXME:製品版になる前に、すべてのKEYにidを入れておく
        updatedAt: new Date().toISOString(),
      }
      data.value[category] = {
        ...categoryData,
        [id]: updatedItem,
      } as any
      hasChanged.value = true
    }
  }

  const removeItem = (category: RecordCategoryType, id: string) => {
    const categoryData = data.value[category] as Record<string, any>

    if (categoryData?.[id]) {
      const { [id]: deleted, ...remaining } = categoryData
      updateCategoryData(category, remaining as any)
    }
  }

  const duplicateItem = <C extends RecordCategoryType>(category: C, id: string): string | null => {
    const item = getItem<RecordCategoryItemTypeMap[C]>(category, id)
    if (!item) return null

    const timestamp = new Date().toISOString()
    const duplicatedItem = {
      ...item,
      id: `${id.replace(/_copy_\d+$/, '')}_copy_${Date.now()}`,
      name: `${item.name} (コピー)`,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    return addItem(category, duplicatedItem)
  }

  const updateRecordProperty = <C extends RecordCategoryType, K extends keyof RecordCategoryItemTypeMap[C]>(
    category: C,
    id: string,
    key: K,
    value: RecordCategoryItemTypeMap[C][K]
  ) => {
    // Partial使ってるのでダブルキャスト
    updateItem(category, id, { [key]: value } as unknown as Partial<RecordCategoryItemTypeMap[C]>)
  }

  // 特殊ケース
  const updateOmikujiPostActions = (
    category: RulesCategoryType,
    ruleId: string,
    omikujiIndex: number,
    postActions: PostActionType[]
  ) => {
    const record = getItem(category, ruleId) as RuleType
    if (!record?.omikuji?.[omikujiIndex]) {
      console.error('指定されたおみくじが見つかりません')
      return
    }

    const updatedOmikuji = [...record.omikuji]
    updatedOmikuji[omikujiIndex] = {
      ...updatedOmikuji[omikujiIndex],
      postActions: postActions.sort((a, b) => a.delaySeconds - b.delaySeconds),
    }

    updateRecordProperty(category, ruleId, 'omikuji', updatedOmikuji)
  }

  // 特殊ケース
  const updatePlaceholderValues = (placeholderId: string, rawValues: Array<PlaceholderValueType | string>) => {
    if (data.value.placeholders[placeholderId]) {
      const parsedValues = PlaceholderValuesSchema.parse(rawValues)
      updateRecordProperty('placeholders', placeholderId, 'values', parsedValues)
    }
  }

  // データアクセス
  const getItem = <T>(category: RecordCategoryType, id: string): T | undefined => {
    return (data.value[category] as Record<string, T>)?.[id]
  }

  const getCategoryMap = <K extends RecordCategoryType>(category: K): Record<string, RecordCategoryItemTypeMap[K]> => {
    return (data.value[category] as Record<string, RecordCategoryItemTypeMap[K]>) || {}
  }

  const getCategoryArray = <K extends RecordCategoryType>(category: K): RecordCategoryItemTypeMap[K][] => {
    return Object.values(getCategoryMap(category)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  // 並び替え
  const reorderItem = async <K extends RecordCategoryType>(category: K, fromIndex: number, toIndex: number) => {
    const items = getCategoryArray(category)
    const ids = items.map((item) => item.id)

    const [movedId] = ids.splice(fromIndex, 1)
    ids.splice(toIndex, 0, movedId)

    const updates = ids.map((id, index) => ({ id, newOrder: index + 1 }))
    await batchUpdateOrder(category, updates)
  }

  const batchUpdateOrder = async <K extends RecordCategoryType>(
    category: K,
    updates: Array<{ id: string; newOrder: number }>
  ) => {
    const categoryData = getCategoryMap(category)
    const updatedData: Record<string, RecordCategoryItemTypeMap[K]> = {}

    Object.entries(categoryData).forEach(([id, item]) => {
      const update = updates.find((u) => u.id === id)
      updatedData[id] = {
        ...item,
        order: update?.newOrder ?? item.order ?? 0,
      }
    })

    await nextTick()
    updateCategoryData(category as CategoryType, updatedData)
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
