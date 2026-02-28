// src/PresetManager/stores/useApiCore.ts
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
import { DevConfigStateType } from '../devTypes'

export function useApiCore(state: DevConfigStateType) {
  // エラーハンドリング
  const handleApiError = (error: Error) => {
    console.error('API Error:', error)
    state.isServerConnected.value = false

    const message = `${error.message}\n開発サーバーが起動していることを確認してください。`
    swalModal.error({ title: '接続エラー', text: message })
  }

  // 非同期アクションのラッパー
  const handleAsyncAction = async <T>(
    action: () => Promise<T>,
    loadingKey: keyof DevConfigStateType
  ): Promise<T | null> => {
    const target = state[loadingKey]
    if (!('value' in target)) {
      throw new Error(`Invalid loading key: ${loadingKey}`)
    }

    target.value = true
    try {
      return await action()
    } catch (error) {
      handleApiError(error as Error)
      return null
    } finally {
      target.value = false
    }
  }

  return {
    handleApiError,
    handleAsyncAction,
  }
}
