// src/ConfigMaker/script/stores/composables/useItemManager.ts (アイテム操作専用)
import { RecordCategoryType, RecordCategoryItemTypeMap } from '@/types/OmikujiData/CategoryType'
import type { useRecordOperations } from './useRecordOperations'
import type { useNavigationManager } from './useNavigationManager'

/**
 * アイテムのCRUD操作とUIとの連携を管理
 */
export function useItemManager(
  recordOps: ReturnType<typeof useRecordOperations>,
  navigation: ReturnType<typeof useNavigationManager>
) {
  /**
   * アイテム追加（現在のカテゴリまたは指定カテゴリに）
   */
  const addItem = <C extends RecordCategoryType>(
    categoryOrItem?: C | Partial<RecordCategoryItemTypeMap[C]>,
    item?: Partial<RecordCategoryItemTypeMap[C]>
  ) => {
    let targetCategory: C
    let itemData: Partial<RecordCategoryItemTypeMap[C]>

    // 引数の解析（オーバーロード対応）
    if (typeof categoryOrItem === 'string') {
      targetCategory = categoryOrItem
      itemData = item || {}
    } else {
      targetCategory = navigation.selectedCategory.value as C
      itemData = categoryOrItem || {}
    }

    const newId = recordOps.addItem(targetCategory, itemData)

    // 追加したカテゴリが現在選択中の場合、新しいアイテムを選択
    if (targetCategory === navigation.selectedCategory.value) {
      navigation.selectRule(newId)
    }

    return newId
  }

  /**
   * アイテム更新
   */
  const updateItem = <C extends RecordCategoryType>(
    category: C,
    id: string,
    updates: Partial<RecordCategoryItemTypeMap[C]>
  ) => {
    recordOps.updateItem(category, id, updates)
  }

  /**
   * アイテム削除（選択状態も自動更新）
   */
  const removeItem = (categoryOrId: RecordCategoryType | string, id?: string) => {
    let targetCategory: RecordCategoryType
    let targetId: string

    // 引数の解析（オーバーロード対応）
    if (typeof categoryOrId === 'string' && id) {
      targetCategory = categoryOrId as RecordCategoryType
      targetId = id
    } else {
      targetCategory = navigation.selectedCategory.value as RecordCategoryType
      targetId = categoryOrId as string
    }

    // 削除前に選択状態を更新
    navigation.selectItemAfterDeletion(targetId, targetCategory)

    // アイテム削除実行
    recordOps.removeItem(targetCategory, targetId)
  }

  /**
   * アイテム複製（新しいアイテムを自動選択）
   */
  const duplicateItem = (categoryOrId: RecordCategoryType | string, id?: string) => {
    let targetCategory: RecordCategoryType
    let targetId: string

    // 引数の解析
    if (typeof categoryOrId === 'string' && id) {
      targetCategory = categoryOrId as RecordCategoryType
      targetId = id
    } else {
      targetCategory = navigation.selectedCategory.value as RecordCategoryType
      targetId = categoryOrId as string
    }

    const newId = recordOps.duplicateItem(targetCategory, targetId)

    if (newId && targetCategory === navigation.selectedCategory.value) {
      navigation.selectRule(newId)
    }

    return newId
  }

  /**
   * アイテム並び替え
   */
  const reorderItems = async (category: RecordCategoryType, fromIndex: number, toIndex: number) => {
    await recordOps.reorderItem(category, fromIndex, toIndex)
  }

  /**
   * 一括order更新
   */
  const batchUpdateOrder = async (category: RecordCategoryType, updates: Array<{ id: string; newOrder: number }>) => {
    await recordOps.batchUpdateOrder(category, updates)
  }

  return {
    // CRUD操作
    addItem,
    updateItem,
    removeItem,
    duplicateItem,

    // 並び替え
    reorderItems,
    batchUpdateOrder,

    // 直接アクセス（必要に応じて）
    getItem: recordOps.getItem,
    getCategoryMap: recordOps.getCategoryMap,
    getCategoryArray: recordOps.getCategoryArray,

    // 特殊操作
    updateOmikujiPostActions: recordOps.updateOmikujiPostActions,
    updatePlaceholderValues: recordOps.updatePlaceholderValues,
  }
}
