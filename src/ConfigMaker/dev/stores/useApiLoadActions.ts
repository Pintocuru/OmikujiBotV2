// src/configMaker/dev/stores/api/useLoadActions.ts
import { devConfigApi } from '../services/apiService'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { DevConfigStateType } from '../devTypes'

export function useLoadActions(
  state: DevConfigStateType,
  handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigStateType) => Promise<any>
) {
  // 設定読み込み
  const applyConfigFile = async (fileName: string) => {
    const omikujiStore = useOmikujiStore()
    return await handleAsyncAction(async () => {
      const configData = await devConfigApi.loadConfig(fileName)
      omikujiStore.loadData(configData)

      // saveFileNameを直接stateから更新
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
