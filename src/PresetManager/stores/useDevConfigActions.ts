// src/PresetManager/stores/useDevConfigActions.ts
import { useDevConfigStateActions } from './useDevConfigStateActions'
import { useApiCore } from './useApiCore'
import { useFileActions } from './useApiFileActions'
import { useSaveActions } from './useApiSaveActions'
import { useLoadActions } from './useApiLoadActions'
import { DevConfigStateType } from '../devTypes'
import { configApi } from '../services/configApi'
import { isDev } from '@/types'

export function useDevConfigActions(state: DevConfigStateType) {
  const stateActions = useDevConfigStateActions(state)
  const { handleAsyncAction } = useApiCore(state)
  const fileActions = useFileActions(state, handleAsyncAction)
  const saveActions = useSaveActions(state, handleAsyncAction)
  const loadActions = useLoadActions(state, handleAsyncAction)

  const setSaveFileName = (name: string = '') => {
    state.saveFileName.value = name
  }

  // サーバモード切り替え
  const toggleExpressMode = async (): Promise<boolean> => {
    if (!isDev) return false

    const isServer = await configApi.getHealth()
    if (!isServer) return false

    const mode = configApi.toggleApiMode()
    state.isExpressMode.value = mode
    return true
  }

  // 状態リセット
  const resetState = () => {
    // ファイル関連
    state.saveFileName.value = ''
    state.availableFiles.value = []

    // ローディング状態
    state.isSaving.value = false
    state.isLoading.value = false
    state.isDeleting.value = false
    state.isLoadingFileList.value = false
    state.isExecutingConfirm.value = false

    // 接続状態
    state.isServerConnected.value = false

    // 個別のファイル削除状態を管理
    state.isDeletingFileMap.clear()
  }

  return {
    ...stateActions,
    ...fileActions,
    ...saveActions,
    ...loadActions,
    toggleExpressMode,
    setSaveFileName,
    resetState,
  }
}
