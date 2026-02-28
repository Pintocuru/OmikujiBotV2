// src/PresetManager/stores/useApiLoadActions.ts
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
import { DevConfigStateType } from '@/PresetManager/devTypes'
import { configApi } from '@/PresetManager/services/configApi'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'

export function useLoadActions(
  state: DevConfigStateType,
  handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigStateType) => Promise<any>
) {
  // 設定読み込み
  const applyConfigFile = async (fileName: string) => {
    const omikujiStore = useOmikujiStore()
    const hasChanged = omikujiStore.hasChanged

    // 変更があるなら確認ダイアログ
    if (hasChanged) {
      const result = await swalModal.confirmDelete({
        title: '変更が保存されていません',
        text: '読み込むと現在の編集内容は失われます。続行しますか？',
        confirmButtonText: '読み込む',
      })

      if (!result.isConfirmed) {
        return null // キャンセル → 処理中断
      }
    }

    // 実処理は handleAsyncAction に任せる
    return await handleAsyncAction(async () => {
      const configData = await configApi.loadConfig(fileName)

      omikujiStore.loadData(configData)
      state.saveFileName.value = fileName

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true

      return configData
    }, 'isLoading')
  }

  // ファイルデータのみ取得
  const fetchFileData = async (fileName: string) => {
    return await configApi.loadConfig(fileName)
  }

  return {
    applyConfigFile,
    fetchFileData,
  }
}
