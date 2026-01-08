// src/configMaker/dev/stores/api/useLoadActions.ts
import { devConfigApi } from '../services/apiService'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { DevConfigStateType } from '../devTypes'
import Swal from 'sweetalert2'

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
      const result = await Swal.fire({
        title: '変更が保存されていません',
        text: '読み込むと現在の編集内容は失われます。続行しますか？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '読み込む',
        cancelButtonText: 'キャンセル',
      })

      if (!result.isConfirmed) {
        return null // キャンセル → 処理中断
      }
    }

    // 実処理は handleAsyncAction に任せる
    return await handleAsyncAction(async () => {
      const configData = await devConfigApi.loadConfig(fileName)

      omikujiStore.loadData(configData)
      state.saveFileName.value = fileName

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true

      return configData
    }, 'isLoading')
  }

  return {
    applyConfigFile,
  }
}
