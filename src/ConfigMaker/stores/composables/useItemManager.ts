// src/ConfigMaker/script/stores/composables/useItemManager.ts
import { RecordCategoryType, RecordCategoryItemTypeMap } from '@/types/OmikujiData/CategoryType'
import type { useNavigationManager } from './useNavigationManager'
import { useRecordCRUD } from './useRecordCRUD'
import { useRecordProperties } from './useRecordProperties'
import { useRecordDataAccess } from './useRecordDataAccess'
import { useRecordSort } from './useRecordSort'

/**
 * アイテムのCRUD操作とUIとの連携を管理
 * keyベースでの操作に統一
 */
export function useItemManager(
  recordDataAccess: ReturnType<typeof useRecordDataAccess>,
  recordCRUD: ReturnType<typeof useRecordCRUD>,
  recordProperties: ReturnType<typeof useRecordProperties>,
  recordSort: ReturnType<typeof useRecordSort>,
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

    // accessLevel はoptionalなので、ここで値を入れる
    itemData.accessLevel = itemData.accessLevel || 'basic'
    const newKey = recordCRUD.addItem(targetCategory, itemData)

    // 追加したカテゴリが現在選択中の場合、新しいアイテムを選択
    if (targetCategory === navigation.selectedCategory.value) {
      navigation.selectItem(newKey)
    }

    return newKey
  }

  /**
   * アイテム更新
   */
  const updateItem = <C extends RecordCategoryType>(
    category: C,
    key: string,
    updates: Partial<RecordCategoryItemTypeMap[C]>
  ) => {
    recordCRUD.updateItem(category, key, updates)
  }

  /**
   * アイテム削除（選択状態も自動更新）
   */
  const removeItem = (categoryOrKey: RecordCategoryType | string, key?: string) => {
    let targetCategory: RecordCategoryType
    let targetKey: string

    // 引数の解析（オーバーロード対応）
    if (typeof categoryOrKey === 'string' && key) {
      targetCategory = categoryOrKey as RecordCategoryType
      targetKey = key
    } else {
      targetCategory = navigation.selectedCategory.value as RecordCategoryType
      targetKey = categoryOrKey as string
    }

    // 削除前に選択状態を更新
    navigation.selectItemAfterDeletion(targetKey, targetCategory)

    // アイテム削除実行
    recordCRUD.removeItem(targetCategory, targetKey)
  }

  /**
   * アイテム複製（新しいアイテムを自動選択）
   */
  const duplicateItem = (categoryOrKey: RecordCategoryType | string, key?: string) => {
    let targetCategory: RecordCategoryType
    let targetKey: string

    // 引数の解析
    if (typeof categoryOrKey === 'string' && key) {
      targetCategory = categoryOrKey as RecordCategoryType
      targetKey = key
    } else {
      targetCategory = navigation.selectedCategory.value as RecordCategoryType
      targetKey = categoryOrKey as string
    }

    const newKey = recordCRUD.duplicateItem(targetCategory, targetKey)

    if (newKey && targetCategory === navigation.selectedCategory.value) {
      navigation.selectItem(newKey)
    }

    return newKey
  }

  /**
   * アイテム並び替え
   */
  const reorderItems = async (category: RecordCategoryType, fromIndex: number, toIndex: number) => {
    await recordSort.reorderItem(category, fromIndex, toIndex)
  }

  /**
   * 一括order更新
   */
  const batchUpdateOrder = async (category: RecordCategoryType, updates: Array<{ key: string; newOrder: number }>) => {
    await recordSort.batchUpdateOrder(category, updates)
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
    getItem: recordDataAccess.getItem,
    getCategoryMap: recordDataAccess.getCategoryMap,
    getCategoryArray: recordDataAccess.getCategoryArray,

    // 特殊操作
    updateOmikujiPostActions: recordProperties.updateOmikujiPostActions,
    updatePlaceholderValues: recordProperties.updatePlaceholderValues,
  }
}
