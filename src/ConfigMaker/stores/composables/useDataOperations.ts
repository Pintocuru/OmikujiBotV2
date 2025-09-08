// src/ConfigMaker/script/stores/composables/useDataOperations.ts (修正版 v3)
import { Ref } from 'vue'
import { RecordCategoryDataMap, RecordCategoryType, recordCategoryLabel } from '@/types/OmikujiData/CategoryType'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { ImportPreview, ImportMode } from '@/ConfigMaker/components/presetsImport/ImportTypes'
import { normalizeData } from '@/migrations'
import { toast } from 'vue-sonner'

/**
 * データの読み込み、保存、マージ機能を提供するコンポーザブル
 */
export function useDataOperations(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  /**
   * データを読み込み、マイグレーションとバリデーションを行う
   */
  const loadData = (loadData: unknown): boolean => {
    try {
      // 1. マイグレーションとバリデーションを兼ねる
      const migratedData = normalizeData(loadData)
      data.value = migratedData
      return true
    } catch (error) {
      toast.error('データの読み込み中にエラーが発生しました。')
      console.error('Load data error:', error)
      return false
    }
  }

  /**
   * 現在のデータをバリデーション
   */
  const validateData = () => {
    return OmikujiDataSchema.safeParse(data.value)
  }

  /**
   * データをJSON形式でエクスポート
   */
  const exportData = () => {
    const validation = validateData()
    if (validation.success) {
      return JSON.stringify(data.value, null, 2)
    }
    throw new Error('データの検証に失敗しました。')
  }

  /**
   * BaseRecordSchemaを含むアイテムかどうかを判定
   */
  const hasOrderProperty = (item: any): item is { order: number } => {
    return item && typeof item === 'object' && 'order' in item && typeof item.order === 'number'
  }

  /**
   * 指定されたカテゴリの最大order値を取得
   */
  const getMaxOrder = (categoryData: Record<string, any>): number => {
    if (!categoryData || typeof categoryData !== 'object') {
      return 0
    }

    const orders = Object.values(categoryData)
      .filter(hasOrderProperty)
      .map((item) => item.order)

    return orders.length > 0 ? Math.max(...orders) : 0
  }

  /**
   * インポートデータのorder値を調整
   */
  const adjustOrderValues = <T extends Record<string, any>>(importItems: T, baseOrder: number): T => {
    if (!importItems || typeof importItems !== 'object') {
      return importItems
    }

    const result = {} as T
    let currentOffset = 0

    Object.entries(importItems).forEach(([key, item]) => {
      if (hasOrderProperty(item)) {
        result[key as keyof T] = {
          ...item,
          order: baseOrder + currentOffset + 1,
        } as T[keyof T]
        currentOffset++
      } else {
        result[key as keyof T] = item
      }
    })

    return result
  }

  /**
   * インポートされたデータを既存データにマージ
   * インポートデータにもマイグレーションを適用
   */
  const mergeDataSets = (importedRawData: unknown, preview: ImportPreview): boolean => {
    try {
      // インポートデータにもマイグレーションを適用
      const importedData = normalizeData(importedRawData)

      // マイグレーション後のデータをバリデーション
      const validation = OmikujiDataSchema.safeParse(importedData)
      if (!validation.success) {
        toast.error('インポートデータの形式が正しくありません。')
        console.error('Import data validation errors:', validation.error)
        return false
      }

      let result: OmikujiDataType

      if (preview.importMode === 'full') {
        // 全体上書きモード - 単純にインポートデータを使用
        result = { ...validation.data }
        toast.success('データの上書きが完了しました。')
      } else {
        // 部分更新モード
        result = { ...data.value }

        // Record型カテゴリのみ処理
        recordCategoryLabel.forEach(<K extends RecordCategoryType>(category: K) => {
          const config = preview.recordCategories[category]
          if (!config?.enabled) return

          const currentItems = result[category]
          const importItems = validation.data[category]

          let adjustedImportItems = importItems
          if (config.mode === 'partial-merge') {
            const maxOrder = getMaxOrder(currentItems)
            adjustedImportItems = adjustOrderValues(importItems, maxOrder)
          }

          const mergedItems = mergeCategoryData(currentItems, adjustedImportItems, config.mode)

          result[category] = mergedItems as OmikujiDataType[typeof category]
        })

        toast.success('データの部分更新が完了しました。')
      }

      data.value = result
      hasChanged.value = true
      return true
    } catch (error) {
      toast.error('データの更新中にエラーが発生しました。')
      console.error('Merge error:', error)
      return false
    }
  }

  /**
   * カテゴリごとのデータマージ処理
   */
  const mergeCategoryData = <C extends RecordCategoryType>(
    currentItems: RecordCategoryDataMap[C],
    importItems: RecordCategoryDataMap[C],
    mode: ImportMode
  ): RecordCategoryDataMap[C] => {
    switch (mode) {
      case 'full-replace':
        // 全体上書き（全データ置き換え）
        return importItems

      case 'partial-replace':
        // 部分置き換え（カテゴリ内の既存データを削除して新しいデータのみ）
        return importItems

      case 'partial-merge':
        // 部分マージ（同じIDがある場合はJSONデータを優先）
        return { ...currentItems, ...importItems }

      default:
        return currentItems
    }
  }

  return {
    loadData,
    validateData,
    exportData,
    mergeDataSets,
  }
}
