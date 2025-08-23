// src/ConfigMaker/script/stores/composables/useDataOperations.ts
import { Ref } from 'vue'
import { CategoryType } from '@/types/OmikujiData/CategoryType'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { ImportPreview, ImportMode } from '@ConfigComponents/presets/useImportPreviewManager'
import { toast } from 'vue-sonner'

/**
 * データの読み込み、保存、マージ機能を提供するコンポーザブル
 */
export function useDataOperations(data: Ref<OmikujiDataType>) {
  /**
   * データを読み込み、バリデーションを行う
   */
  const loadData = (loadData: unknown): boolean => {
    try {
      const parsed = OmikujiDataSchema.safeParse(loadData)
      if (parsed.success) {
        data.value = parsed.data
        toast.success('データを正常に読み込みました。')
        return true
      } else {
        toast.error('データの形式が正しくありません。')
        console.error('Validation errors:', parsed.error)
        return false
      }
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
   * インポートされたデータを既存データにマージ
   */
  const mergeDataSets = (importedData: OmikujiDataType, preview: ImportPreview): boolean => {
    try {
      const result: OmikujiDataType = { ...data.value }

      Object.entries(preview.categories).forEach(([categoryKey, config]) => {
        if (!config.enabled) return

        const category = categoryKey as CategoryType
        const currentItems = result[category] as Record<string, unknown>
        const importItems = importedData[category] as Record<string, unknown>
        const mergedItems = mergeCategoryData(currentItems, importItems, config.mode)

        result[category] = mergedItems as any
      })

      data.value = result
      toast.success('データのマージが完了しました。')
      return true
    } catch (error) {
      toast.error('データのマージ中にエラーが発生しました。')
      console.error('Merge error:', error)
      return false
    }
  }

  /**
   * カテゴリごとのデータマージ処理
   */
  const mergeCategoryData = (
    currentItems: Record<string, unknown>,
    importItems: Record<string, unknown>,
    mode: ImportMode
  ): Record<string, unknown> => {
    switch (mode) {
      case 'replace':
        return importItems
      case 'merge':
        return { ...currentItems, ...importItems }
    }
  }

  return {
    loadData,
    validateData,
    exportData,
    mergeDataSets,
  }
}
