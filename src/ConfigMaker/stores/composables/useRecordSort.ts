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
    // orderがない場合にエラーが起きている
    /**
     * 型 'Record<string, RecordCategoryItemTypeMap[K]>' の引数を型 '{ id: string; name: string; description: string; version: string; generatorName: string; generatorVersion: string; dataVersion: number; author: string; tags: string[]; license: string; url?: string | undefined; } | ... 6 more ... | { ...; }' のパラメーターに割り当てることはできません。
  型 'Record<string, RecordCategoryItemTypeMap[K]>' には 型 '{ sourceFile: string; keySuffix: string; remaps: { fromCharacterKey: string; toCharacterKey: string; fromIconKey: string; toIconKey: string; }[]; order: number; tags: string[]; accessLevel: "basic" | "pro" | "internal" | "experimental"; ... 7 more ...; description?: string | undefined; }[]' からの次のプロパティがありません: length, pop, push, concat、28 など。ts(2345)
     */
    updateCategoryData(category as CategoryType, updatedData)
  }

  return {
    reorderItem,
    batchUpdateOrder,
  }
}
