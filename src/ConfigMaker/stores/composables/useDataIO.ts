// src/ConfigMaker/script/stores/composables/useDataIO.ts
import { Ref } from 'vue'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { normalizeData } from '@/common/migrations'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

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
      swalModal.error({ title: 'データの読み込み中にエラーが発生しました', text: error })
      console.error('Load data error:', error)
      return false
    }
  }

  /**
   * グローバルの omikujiData.js を開く
   */
  //
  const openLocalOmikujiData = () => {
    loadData(window.omikujiData)
    swalToast.success({ title: '読み込み完了', text: 'omikujiData.js を読み込みました。' })
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

    swalModal.error({
      title: 'データの検証に失敗しました',
      text: '内容に不備があるため、エクスポートできません。',
    })
  }

  return {
    loadData,
    openLocalOmikujiData,
    safeValidateData,
    exportData,
  }
}
