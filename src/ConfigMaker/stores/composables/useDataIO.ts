// src/ConfigMaker/script/stores/composables/useDataIO.ts
import { Ref } from 'vue'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { normalizeData } from '@/migrations'
import { toast } from 'vue-sonner'

/**
 * データの入出力（読み込み・保存・エクスポート）を提供
 */
export function useDataIO(data: Ref<OmikujiDataType>) {
  // ========================================
  // データ読み込み
  // ========================================
  /**
   * データを読み込み、マイグレーションとバリデーションを行う
   */
  const loadData = (loadData: unknown): boolean => {
    try {
      const migratedData = normalizeData(loadData)
      data.value = migratedData
      return true
    } catch (error) {
      toast.error('データの読み込み中にエラーが発生しました。')
      console.error('Load data error:', error)
      return false
    }
  }

  // ========================================
  // データ検証
  // ========================================
  /**
   * 現在のデータをバリデーション
   */
  const validateData = () => {
    return OmikujiDataSchema.safeParse(data.value)
  }

  // ========================================
  // データエクスポート
  // ========================================
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

  return {
    loadData,
    validateData,
    exportData,
  }
}
