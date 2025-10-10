// src/ConfigMaker/script/stores/composables/useRecordSort.ts
import { nextTick, Ref } from 'vue'
import { CategoryType, RecordCategoryType, RecordCategoryItemTypeMap } from '@/types/OmikujiData/CategoryType'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import type { useRecordDataAccess } from './useRecordDataAccess'

/**
 * レコード型アイテムの並び替え機能を提供
 */
export function useRecordSort(
  data: Ref<OmikujiDataType>,
  hasChanged: Ref<boolean>,
  recordDataAccess: ReturnType<typeof useRecordDataAccess>
) {
  // ========================================
  // カテゴリデータ更新（内部用）
  // ========================================
  const updateCategoryData = <C extends CategoryType>(category: C, newData: OmikujiDataType[C]) => {
    data.value[category] = newData
    hasChanged.value = true
  }

  // ========================================
  // アイテムの並び替え
  // ========================================
  const reorderItem = async <K extends RecordCategoryType>(category: K, fromIndex: number, toIndex: number) => {
    const items = recordDataAccess.getCategoryArray(category)
    const keys = items.map((item) => item.key)

    const [movedKey] = keys.splice(fromIndex, 1)
    keys.splice(toIndex, 0, movedKey)

    const updates = keys.map((key, index) => ({ key, newOrder: index + 1 }))
    await batchUpdateOrder(category, updates)
  }

  // ========================================
  // 一括order更新
  // ========================================
  const batchUpdateOrder = async <K extends RecordCategoryType>(
    category: K,
    updates: Array<{ key: string; newOrder: number }>
  ) => {
    const categoryData = recordDataAccess.getCategoryMap(category)
    const updatedData: Record<string, RecordCategoryItemTypeMap[K]> = {}

    Object.entries(categoryData).forEach(([key, item]) => {
      const update = updates.find((u) => u.key === key)
      updatedData[key] = {
        ...item,
        order: update?.newOrder ?? item.order ?? 0,
      }
    })

    await nextTick()
    updateCategoryData(category as CategoryType, updatedData)
  }

  return {
    reorderItem,
    batchUpdateOrder,
  }
}
