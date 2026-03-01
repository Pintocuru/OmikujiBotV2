// src/MainGenerator/stores/useAppStatus.ts
import { ref } from 'vue'
import { AppStatus } from '@shared/types/core/AppStatus'

export const useAppStatus = () => {
  /**
   * 状態
   */
  const status = ref<AppStatus>('initializing')
  const errorDetail = ref<string | null>(null)

  // status変更
  const setStatus = (value: AppStatus) => {
    status.value = value
    // error以外になったらリセット
    if (value !== 'error') errorDetail.value = null
  }

  // エラー時
  const setError = (detail: string) => {
    errorDetail.value = detail
    status.value = 'error'
  }
  return {
    // 状態
    status,
    errorDetail,

    // アクション
    setStatus,
    setError,
  }
}
