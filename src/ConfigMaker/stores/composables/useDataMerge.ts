// src/ConfigMaker/script/stores/composables/useDataMerge.ts
import { Ref } from 'vue'
import { RecordCategoryType, recordCategoryLabel } from '@/types/OmikujiData/CategoryType'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { useDataMergeHelpers } from './useDataMergeHelpers'
import { ImportPreview } from '@/ConfigMaker/components/presetsImport/ImportTypes'
import { normalizeData } from '@/Toolkit/migrations'
import Swal from 'sweetalert2'

/**
 * データマージ機能
 */
export function useDataMerge(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  const helpers = useDataMergeHelpers()
  /**
   * インポートされたデータを既存データにマージ
   * インポートデータにもマイグレーションを適用
   */
  const mergeDataSets = (importedRawData: unknown, preview: ImportPreview): boolean => {
    try {
      // インポートデータにマイグレーション&バリデーションを適用
      const importedData = normalizeData(importedRawData)

      let result: OmikujiDataType

      // 部分更新モード
      result = processPartialMerge(importedData, preview)

      // 成功トースト（右下）
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'データの部分更新が完了しました。',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      data.value = result
      hasChanged.value = true
      return true
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'データの更新中にエラーが発生しました',
        text: '詳細はコンソールをご確認ください。',
      })
      console.error('Merge error:', error)
      return false
    }
  }

  /**
   * 部分マージ処理
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
