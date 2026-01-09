// src/configMaker/dev/stores/api/useFileActions.ts
import { DevConfigStateType } from '@config/dev/devTypes'
import { configApi } from '@config/dev/services/configApi'
import Swal from 'sweetalert2'

export function useFileActions(
  state: DevConfigStateType,
  handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigStateType) => Promise<any>
) {
  // ファイル一覧取得
  const fetchFileList = async () => {
    return await handleAsyncAction(async () => {
      const files = await configApi.getFileList()
      state.availableFiles.value = files
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
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '複製完了',
        text: `設定ファイル "${originalName}" を複製しました`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      state.isServerConnected.value = true
      return null
    }, 'isSaving')
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
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '名前変更完了',
        text: `設定ファイル名を "${oldFileName.replace('.json', '')}" から "${newFileName}" に変更しました`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // ファイル削除（確認ダイアログ）
  const deleteFile = async (fileName: string) => {
    const displayName = fileName.replace('.json', '')

    const result = await Swal.fire({
      icon: 'warning',
      title: '削除確認',
      text: `設定ファイル "${displayName}" を削除しますか？`,
      showCancelButton: true,
      confirmButtonText: '削除',
      cancelButtonText: 'キャンセル',
    })

    if (!result.isConfirmed) return

    state.isDeletingFileMap.set(fileName, true)

    try {
      await configApi.deleteConfig(fileName)

      const index = state.availableFiles.value.findIndex((f: any) => f.name === fileName)
      if (index >= 0) {
        state.availableFiles.value.splice(index, 1)
      }

      // 成功トースト
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '削除完了',
        text: `設定ファイル "${displayName}" を削除しました`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      state.isServerConnected.value = true
    } catch (error) {
      console.error('API Error:', error)
      state.isServerConnected.value = false

      const message = `${(error as Error).message}\n開発サーバーが起動していることを確認してください。`

      // エラーダイアログ
      Swal.fire({
        icon: 'error',
        title: '接続エラー',
        text: message,
      })
    } finally {
      state.isDeletingFileMap.delete(fileName)
    }
  }

  return {
    fetchFileList,
    fetchFileData,
    duplicateFile,
    renameFile,
    deleteFile,
  }
}
