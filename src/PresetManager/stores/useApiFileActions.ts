// src/PresetManager/stores/useApiFileActions.ts
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { DevConfigStateType } from '@/PresetManager/devTypes'
import { configApi } from '@/PresetManager/services/configApi'
import { ensureJsonExtension, toFileItem } from '../services/apiServiceUtils'

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

      await configApi.saveConfig(duplicateName, JSON.stringify(configData))
      await fetchFileList()

      // 成功トースト
      const displayName = fileName.split('/').pop()!.replace('.json', '')
      swalToast.success({ title: `設定ファイル "${displayName}" を複製しました` })
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
    // moveが使えないので
    const oldBase = oldFileName.toLowerCase()
    const newBase = ensureJsonExtension(newFileName).toLowerCase()
    if (oldBase === newBase) {
      throw new Error('大文字小文字だけの変更はサポートされていません')
    }

    return await handleAsyncAction(async () => {
      // フォルダを保持
      const folder = oldFileName.includes('/') ? oldFileName.split('/')[0] : null

      const finalName = folder ? `${folder}/${newFileName}` : newFileName

      // データ読み込み
      const configData = await configApi.loadConfig(oldFileName)

      // 新しい名前で保存
      await configApi.saveConfig(finalName, JSON.stringify(configData))

      // 古いファイルを削除
      await configApi.deleteConfig(oldFileName)

      // ローカル状態更新
      const file = state.availableFiles.value.find((f) => f.name === oldFileName)
      if (file) {
        file.name = finalName
        file.displayName = newFileName.replace('.json', '')
      }

      await fetchFileList()

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
