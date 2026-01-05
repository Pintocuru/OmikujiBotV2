// src\ConfigMaker\stores\Navigation\useNavigationStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { CategoryType, RecordCategoryType, recordCategoryLabel } from '@/types/OmikujiData/'
import { useGetRecordData } from './useGetRecordData'

/**
 * ナビゲーションstore
 */
export const useNavigationStore = defineStore('navigation', () => {
  // data取得
  const recordDataAccess = useGetRecordData()

  // 状態
  const selectedCategory = ref<CategoryType>('comments')
  // TODO:最初はnullなので、なんとかしてnullでない方法にしたい
  const selectedItemKey = ref<string | null>(null)

  // 計算プロパティ
  const isRecordCategory = (category: CategoryType): category is RecordCategoryType =>
    recordCategoryLabel.includes(category as RecordCategoryType)

  const getOrderedItems = (category: RecordCategoryType) => {
    const items = recordDataAccess.getCategoryMap(category)
    return Object.values(items).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  // カテゴリ選択
  const selectCategory = (category: CategoryType) => {
    selectedCategory.value = category

    if (!isRecordCategory(category)) {
      selectedItemKey.value = null
      return
    }

    const firstItem = getOrderedItems(category)[0]
    selectedItemKey.value = firstItem?.key ?? null
  }

  // アイテム選択
  const selectItem = (key: string) => {
    selectedItemKey.value = key
  }

  /**
   * アイテム削除後に適切なアイテムを選択する
   * 削除されたアイテムより前のアイテムを優先的に選択
   */
  const selectItemAfterDeletion = (deletedKey: string, category: RecordCategoryType) => {
    if (selectedItemKey.value !== deletedKey || category !== selectedCategory.value) {
      return // 削除対象が選択中でない、または別カテゴリの場合は何もしない
    }

    const items = recordDataAccess.getCategoryMap(category)
    const deletedItem = items[deletedKey]
    const currentOrder = deletedItem?.order ?? 0

    // 利用可能なアイテムを取得（削除対象を除外）
    const availableItems = Object.entries(items)
      .filter(([key]) => key !== deletedKey)
      .map(([key, item]) => ({ key, order: item.order ?? 0 }))
      .sort((a, b) => a.order - b.order)

    if (availableItems.length === 0) {
      selectedItemKey.value = null
      return
    }

    // 削除アイテムより小さいorder値のアイテムを探す
    const previousItem = availableItems
      .slice()
      .reverse()
      .find((item) => item.order < currentOrder)

    selectedItemKey.value = previousItem?.key || availableItems[0]?.key || null
  }

  return {
    // 状態
    selectedCategory,
    selectedItemKey,

    // 操作
    selectCategory,
    selectItem,
    selectItemAfterDeletion,
  }
})
