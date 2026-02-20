// src/ConfigMaker/dev/stores/useApiSaveActions.ts
import { DevConfigStateType } from '@config/dev/devTypes'
import { configApi } from '@config/dev/services/configApi'
import { generatorApi } from '@config/dev/services/generatorApi'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

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
      if (!res) throw new Error('設定の保存に失敗しました')

      await fetchFileList()
      swalToast.success({ title: `設定を "${trimmedFileName}" として保存しました` })

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true

      return true
    }, 'isSaving')
  }

  // ジェネレーターに保存
  const saveToGenerator = async () => {
    const generatorId = window.omikujiData?.meta.id
    if (!generatorId) {
      throw new Error('generatorId が存在しないため、ジェネレーター用設定を保存できません')
    }

    const result = await swalModal.confirmDelete({
      icon: 'info',
      title: 'ジェネレーターに保存',
      html: `
    <p>現在の設定をジェネレーター用として保存しますか？</p>
    <p style="font-size: 0.8em; color: #666; margin-top: 8px;">
      プリセットID: ${generatorId}
    </p>
  `,
      confirmButtonText: '保存',
    })
    if (!result.isConfirmed) return
    const omikujiStore = useOmikujiStore()

    // ★ store の data は触らない。保存用にだけコピーを作る
    const dataForSave = {
      ...omikujiStore.data,
      meta: {
        ...omikujiStore.data.meta,
        id: generatorId,
      },
    }

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(dataForSave, null, 2)
      await generatorApi.saveGeneratorConfig(configData)
      await fetchFileList()
      omikujiStore.resetChangeState()

      swalToast.success({ title: 'ジェネレーター用設定を保存しました' })
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // 上書き保存（確認ダイアログ）
  const overwriteConfig = async (fileName: string) => {
    const displayName = fileName.replace('.json', '')

    const result = await swalModal.confirmDelete({
      title: '上書き確認',
      text: `設定ファイル "${displayName}" を現在のデータで上書きしますか？`,
      confirmButtonText: '上書き',
    })

    if (!result.isConfirmed) return

    const omikujiStore = useOmikujiStore()

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data, null, 2)
      await configApi.saveConfig(fileName, configData)
      await fetchFileList()

      // 成功トースト
      swalToast.success({ title: `設定ファイル "${displayName}" を上書きしました` })

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // assets/omikujiData.js に保存（確認ダイアログ）
  const overwriteOmikujiData = async () => {
    const result = await swalModal.confirmDelete({
      title: '上書き確認',
      text: `設定ファイル "omikujiData.js" を assets に上書きしますか？`,
      confirmButtonText: '上書き',
    })

    if (!result.isConfirmed) return

    const omikujiStore = useOmikujiStore()

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data, null, 2)
      await configApi.saveOmikujiData(configData)
      await fetchFileList()

      // 成功トースト
      swalToast.success({ title: `設定ファイル "omikujiData.js" を上書きしました` })
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  return {
    checkServer,
    saveConfig,
    saveToGenerator,
    overwriteConfig,
    overwriteOmikujiData,
  }
}
