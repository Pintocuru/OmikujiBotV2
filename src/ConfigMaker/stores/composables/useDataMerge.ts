// src/ConfigMaker/script/stores/composables/useDataMerge.ts
import { Ref } from 'vue'
import { RecordCategoryType, recordCategoryLabel } from '@/types/OmikujiData/CategoryType'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { ImportPreview } from '@/ConfigMaker/components/presetsImport/ImportTypes'
import { normalizeData } from '@/migrations'
import { toast } from 'vue-sonner'
import { useDataMergeHelpers } from './useDataMergeHelpers'

/**
 * データマージ機能を提供
 */
export function useDataMerge(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  const helpers = useDataMergeHelpers()

  // ========================================
  // データマージ
  // ========================================
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
        // 全体上書きモード
        result = { ...validation.data }
        toast.success('データの上書きが完了しました。')
      } else {
        // 部分更新モード
        result = processPartialMerge(validation.data, preview)
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

  // ========================================
  // 部分マージ処理
  // ========================================
  /**
   * 部分更新モードの処理
   */
  const processPartialMerge = (importedData: OmikujiDataType, preview: ImportPreview): OmikujiDataType => {
    const result: OmikujiDataType = { ...data.value }

    // Record型カテゴリのみ処理
    recordCategoryLabel.forEach(<K extends RecordCategoryType>(category: K) => {
      const config = preview.recordCategories[category]
      if (!config?.enabled) return

      const currentItems = result[category]
      const importItems = importedData[category]

      // partial-mergeの場合はorder値を調整
      let adjustedImportItems = importItems
      if (config.mode === 'partial-merge') {
        const maxOrder = helpers.getMaxOrder(currentItems)
        adjustedImportItems = helpers.adjustOrderValues(importItems, maxOrder)
      }

      // マージ実行
      const mergedItems = helpers.mergeCategoryData(currentItems, adjustedImportItems, config.mode)
      result[category] = mergedItems as OmikujiDataType[typeof category]
    })

    return result
  }

  return {
    mergeDataSets,
  }
}
