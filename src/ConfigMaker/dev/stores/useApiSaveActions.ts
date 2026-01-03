// src/configMaker/dev/stores/api/useSaveActions.ts
import { devConfigApi } from '../services/apiService'
import { generateDateFileName } from '../services/devConfigUtils'
import { DevConfigStateType } from '../devTypes'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import Swal from 'sweetalert2'

export function useSaveActions(
  state: DevConfigStateType,
  handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigStateType) => Promise<any>
) {
  // ファイル一覧取得
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

      // 成功トースト（右下）
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '保存完了',
        text: `設定を "${trimmedFileName}" として保存しました`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // 上書き保存（確認ダイアログ）
  const overwriteConfig = async (fileName: string) => {
    const displayName = fileName.replace('.json', '')

    const result = await Swal.fire({
      icon: 'warning',
      title: '上書き確認',
      text: `設定ファイル "${displayName}" を現在のデータで上書きしますか？`,
      showCancelButton: true,
      confirmButtonText: '上書き',
      cancelButtonText: 'キャンセル',
    })

    if (!result.isConfirmed) return

    const omikujiStore = useOmikujiStore()

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data, null, 2)
      await devConfigApi.saveConfig(fileName, configData)
      await fetchFileList()

      // 成功トースト
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '上書き完了',
        text: `設定ファイル "${displayName}" を上書きしました`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // assets/omikujiData.js に保存（確認ダイアログ）
  const overwriteOmikujiData = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '上書き確認',
      text: `設定ファイル "omikujiData.js" を assets に上書きしますか？`,
      showCancelButton: true,
      confirmButtonText: '上書き',
      cancelButtonText: 'キャンセル',
    })

    if (!result.isConfirmed) return

    const omikujiStore = useOmikujiStore()

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data, null, 2)
      await devConfigApi.saveOmikujiData(configData)
      await fetchFileList()

      // 成功トースト
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '上書き完了',
        text: `設定ファイル "omikujiData.js" を上書きしました`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  return {
    saveConfigAutoName,
    saveConfig,
    overwriteConfig,
    overwriteOmikujiData,
  }
}
