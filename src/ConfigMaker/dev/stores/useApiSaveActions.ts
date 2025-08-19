// src/configMaker/dev/stores/api/useSaveActions.ts
import { devConfigApi } from '../services/apiService'
import { generateDateFileName } from '../services/devConfigUtils'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { toast } from 'vue-sonner'
import { DevConfigStateType } from '../devTypes'

export function useSaveActions(
  state: DevConfigStateType,
  handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigStateType) => Promise<any>
) {
  // ファイル一覧取得（他のファイルとの共通処理）
  const fetchFileList = async () => {
    const files = await devConfigApi.getFileList()
    state.availableFiles.value = files
    state.isServerConnected.value = true
    return files
  }

  // 日付ファイル名で保存
  const saveConfigAutoName = async () => {
    const fileName = generateDateFileName()
    await saveConfig(fileName)
  }

  // 名前指定で保存
  const saveConfig = async (fileName: string) => {
    const omikujiStore = useOmikujiStore()
    const trimmedFileName = fileName.trim()
    if (!trimmedFileName) return

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data, null, 2)
      await devConfigApi.saveConfig(trimmedFileName, configData)
      await fetchFileList()

      toast.success('保存完了', {
        description: `設定を "${trimmedFileName}" として保存しました`,
        duration: 3000,
      })

      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // 上書き保存（確認toast付き）
  const overwriteConfig = async (fileName: string) => {
    const displayName = fileName.replace('.json', '')

    toast.warning('上書き確認', {
      description: `設定ファイル "${displayName}" を現在のデータで上書きしますか？`,
      duration: 10000,
      action: {
        label: '上書き',
        onClick: async () => {
          const omikujiStore = useOmikujiStore()

          return await handleAsyncAction(async () => {
            const configData = JSON.stringify(omikujiStore.data, null, 2)
            await devConfigApi.saveConfig(fileName, configData)
            await fetchFileList()

            toast.success('上書き完了', {
              description: `設定ファイル "${displayName}" を上書きしました`,
              duration: 3000,
            })

            state.isServerConnected.value = true
            return null
          }, 'isSaving')
        },
      },
      cancel: {
        label: 'キャンセル',
        onClick: () => {
          toast.dismiss()
        },
      },
    })
  }

  // assets/omikujiData.js におみくじデータを保存
  const overwriteOmikujiData = async () => {
    toast.warning('上書き確認', {
      description: `設定ファイル "omikujiData.js" を assets に上書きしますか？`,
      duration: 10000,
      action: {
        label: '上書き',
        onClick: async () => {
          const omikujiStore = useOmikujiStore()

          return await handleAsyncAction(async () => {
            const configData = JSON.stringify(omikujiStore.data, null, 2)
            await devConfigApi.saveOmikujiData(configData)
            await fetchFileList()
            toast.success('上書き完了', {
              description: `設定ファイル "omikujiData.js" を上書きしました`,
              duration: 3000,
            })

            state.isServerConnected.value = true
            return null
          }, 'isSaving')
        },
      },
      cancel: {
        label: 'キャンセル',
        onClick: () => {
          toast.dismiss()
        },
      },
    })
  }

  return {
    saveConfigAutoName,
    saveConfig,
    overwriteConfig,
    overwriteOmikujiData,
  }
}
