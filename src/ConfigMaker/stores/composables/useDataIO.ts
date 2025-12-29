// src/ConfigMaker/script/stores/composables/useDataIO.ts
import { Ref } from 'vue'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { normalizeData } from '@/common/migrations'
import Swal from 'sweetalert2'

/**
 * データの入出力（読み込み・保存・エクスポート）を提供
 */
export function useDataIO(data: Ref<OmikujiDataType>) {
  /**
   * データを読み込み、マイグレーションとバリデーションを行う
   */
  const loadData = (loadData: unknown): boolean => {
    try {
      const migratedData = normalizeData(loadData)
      data.value = migratedData
      return true
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'データの読み込み中にエラーが発生しました',
        text: 'ファイル形式が正しいかご確認ください。',
      })
      console.error('Load data error:', error)
      return false
    }
  }

  /**
   * 現在のデータをバリデーション
   */
  const safeValidateData = () => {
    return OmikujiDataSchema.safeParse(data.value)
  }

  /**
   * データをJSON形式でエクスポート
   */
  const exportData = () => {
    const validation = safeValidateData()
    if (validation.success) {
      return JSON.stringify(data.value, null, 2)
    }

    Swal.fire({
      icon: 'error',
      title: 'データの検証に失敗しました',
      text: '内容に不備があるため、エクスポートできません。',
    })
  }

  return {
    loadData,
    safeValidateData,
    exportData,
  }
}
