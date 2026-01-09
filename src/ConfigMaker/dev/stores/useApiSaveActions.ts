// src/configMaker/dev/stores/api/useSaveActions.ts
import { DevConfigStateType } from '@config/dev/devTypes'
import { configApi } from '@config/dev/services/configApi'
import { generatorApi } from '@config/dev/services/generatorApi'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import Swal from 'sweetalert2'

export function useSaveActions(
  state: DevConfigStateType,
  handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigStateType) => Promise<any>
) {
  // サーバチェック
  const checkServer = async (): Promise<boolean> => {
    return await configApi.getHealth()
  }

  // ファイル一覧取得
  const fetchFileList = async () => {
    const files = await configApi.getFileList()
    state.availableFiles.value = files
    state.isServerConnected.value = true
    return files
  }

  // 名前指定で保存
  const saveConfig = async (fileName: string): Promise<boolean> => {
    const omikujiStore = useOmikujiStore()
    const trimmedFileName = fileName.trim()
    if (!trimmedFileName) return false

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data, null, 2)
      const res = await configApi.saveConfig(trimmedFileName, configData)

      if (!res) {
        throw new Error('設定の保存に失敗しました')
      }

      await fetchFileList()

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

      return true
    }, 'isSaving')
  }

  // ジェネレーターに保存
  const saveToGenerator = async () => {
    const result = await Swal.fire({
      icon: 'info',
      title: 'ジェネレーターに保存',
      text: '現在の設定をジェネレーター用として保存しますか？',
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: 'キャンセル',
    })

    if (!result.isConfirmed) return

    const omikujiStore = useOmikujiStore()

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data, null, 2)
      await generatorApi.saveGeneratorConfig(configData)
      await fetchFileList()
      omikujiStore.resetChangeState() // 変更リセット

      // 成功トースト
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '保存完了',
        text: 'ジェネレーター用設定を保存しました',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

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
      await configApi.saveConfig(fileName, configData)
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
      await configApi.saveOmikujiData(configData)
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

  // APIモード切り替え
  const toggleApiMode = () => {
    // TODO:ping打ってサーバ確認してから作業を行うこと

    configApi.toggleApiMode()
    state.isExpressMode.value = !state.isExpressMode.value

    const modeName = state.isExpressMode.value ? 'Express (DEV)' : 'Plugin'
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'info',
      title: 'APIモード切り替え',
      text: `${modeName} モードに切り替えました`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })
  }

  return {
    checkServer,
    saveConfig,
    saveToGenerator,
    overwriteConfig,
    overwriteOmikujiData,
    toggleApiMode,
  }
}
