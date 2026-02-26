// src/ConfigMaker/dev/stores/useApiFileActions.ts
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { DevConfigStateType } from '@/PresetManager/devTypes'
import { configApi } from '@/PresetManager/services/configApi'
import { toFileItem } from '../services/apiServiceUtils'

export function useFileActions(
  state: DevConfigStateType,
  handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigStateType) => Promise<any>
) {
  // ファイル一覧取得
  const fetchFileList = async () => {
    return await handleAsyncAction(async () => {
      const files = await configApi.getFileList()
      state.availableFiles.value = files.map(toFileItem)
      state.isServerConnected.value = true
      return files
    }, 'isLoadingFileList')
  }

  // ファイルデータ取得
  const fetchFileData = async (fileName: string) => {
    return await handleAsyncAction(async () => {
      const configData = await configApi.loadConfig(fileName)
      state.isServerConnected.value = true
      return configData
    }, 'isLoading')
  }

  // ファイル複製
  const duplicateFile = async (fileName: string) => {
    return await handleAsyncAction(async () => {
      const configData = await configApi.loadConfig(fileName)
      const originalName = fileName.replace('.json', '')
      const duplicateName = `${originalName}_copy`

      await configApi.saveConfig(duplicateName, JSON.stringify(configData, null, 2))
      await fetchFileList()

      // 成功トースト
      swalToast.success({ title: `設定ファイル "${originalName}" を複製しました` })
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // ファイルを別フォルダへ移動
  const moveFile = async (fromName: string, toFolder: string) => {
    const fileName = fromName.split('/').pop()! // "file.json"
    const toName = toFolder ? `${toFolder}/${fileName}` : fileName

    if (fromName === toName) return

    return await handleAsyncAction(async () => {
      await configApi.moveConfig(fromName, toName)
      await fetchFileList()

      // 成功トースト
      swalToast.success({
        title: `設定ファイル名を "${fromName.replace('.json', '')}" から "${toFolder}" に変更しました`,
      })
    }, 'isLoading')
  }

  // ファイル名変更
  const renameFile = async (oldFileName: string, newFileName: string) => {
    return await handleAsyncAction(async () => {
      const configData = await configApi.loadConfig(oldFileName)
      await configApi.saveConfig(newFileName, JSON.stringify(configData, null, 2))
      await configApi.deleteConfig(oldFileName)

      const file = state.availableFiles.value.find((f: any) => f.name === oldFileName)
      if (file) {
        file.name = newFileName
      }
      await fetchFileList()

      // 成功トースト
      swalToast.success({
        title: `設定ファイル名を "${oldFileName.replace('.json', '')}" から "${newFileName}" に変更しました`,
      })

      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // ファイル削除（確認ダイアログ）
  const deleteFile = async (fileName: string) => {
    const displayName = fileName.replace('.json', '')

    const result = await swalModal.confirmDelete({
      title: `設定ファイル "${displayName}" を削除しますか？`,
    })

    if (!result.isConfirmed) return

    state.isDeletingFileMap.set(fileName, true)

    try {
      await configApi.deleteConfig(fileName)

      const index = state.availableFiles.value.findIndex((f: any) => f.name === fileName)
      if (index >= 0) state.availableFiles.value.splice(index, 1)

      swalToast.success({ title: `設定ファイル "${displayName}" を削除しました` })
      state.isServerConnected.value = true
    } catch (error) {
      console.error('API Error:', error)
      state.isServerConnected.value = false

      // エラーダイアログ
      const message = `${(error as Error).message}\nサーバーが起動していることを確認してください。`
      swalModal.error({ title: '接続エラー', text: message })
    } finally {
      state.isDeletingFileMap.delete(fileName)
    }
  }

  return {
    fetchFileList,
    fetchFileData,
    duplicateFile,
    renameFile,
    moveFile,
    deleteFile,
  }
}
