// src/ConfigMaker/stores/composables/useRecordSort.ts
import { nextTick, Ref } from 'vue'
import { RecordCategoryType, RecordCategoryItemTypeMap } from '@/types/OmikujiData/'
import { OmikujiDataType } from '@/types/OmikujiData/'

/**
 * レコード型アイテムの並び替え機能を提供
 */
export function useRecordSort(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  // アイテムの並び替え
  const reorderItem = async <K extends RecordCategoryType>(category: K, fromIndex: number, toIndex: number) => {
    const items = Object.values(data.value[category]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const keys = items.map((item) => item.key)

    const [movedKey] = keys.splice(fromIndex, 1)
    keys.splice(toIndex, 0, movedKey)

    const updates = keys.map((key, index) => ({ key, newOrder: index + 1 }))
    await batchUpdateOrder(category, updates)
  }

  // 一括order更新
  const batchUpdateOrder = async <K extends RecordCategoryType>(
    category: K,
    updates: Array<{ key: string; newOrder: number }>
  ) => {
    const categoryData = data.value[category]
    const updatedData: Record<string, RecordCategoryItemTypeMap[K]> = {}

    Object.entries(categoryData).forEach(([key, item]) => {
      const update = updates.find((u) => u.key === key)
      updatedData[key] = {
        ...item,
        order: update?.newOrder ?? item.order ?? 0,
      }
    })

    await nextTick()
    updateCategoryData(category, updatedData as any)
  }

  // カテゴリデータ更新（内部用）
  const updateCategoryData = <C extends RecordCategoryType>(category: C, newData: OmikujiDataType[C]) => {
    data.value[category] = newData
    hasChanged.value = true
  }

  return {
    reorderItem,
    batchUpdateOrder,
  }
}
