// src/configMaker/dev/stores/api/useLoadActions.ts
import { devConfigApi } from '../services/apiService'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { DevConfigStateType } from '../devTypes'
import { toast } from 'vue-sonner'

export function useLoadActions(
  state: DevConfigStateType,
  handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigStateType) => Promise<any>
) {
  // 設定読み込み
  const loadConfig = async (fileName: string) => {
    const omikujiStore = useOmikujiStore()
    return await handleAsyncAction(async () => {
      const configData = await devConfigApi.loadConfig(fileName)
      omikujiStore.loadData(configData)

      // saveFileNameを直接stateから更新
      state.saveFileName.value = fileName

      toast.success('読み込み完了', {
        description: `設定 "${fileName.replace('.json', '')}" を読み込みました`,
        duration: 3000,
      })
      omikujiStore.resetChangeState()

      state.isServerConnected.value = true
      return configData
    }, 'isLoading')
  }

  return {
    loadConfig,
  }
}
