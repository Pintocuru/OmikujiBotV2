// src/configMaker/components/presets/useJsonImporter.ts (更新版)
import { ref, computed } from 'vue'
import type { OmikujiDataType, CategoryType } from '@/types/'
import { useJsonFileLoader } from './useJsonFileLoader'
import { useJsonServerLoader } from './useJsonServerLoader'
import { useImportPreviewManager } from './useImportPreviewManager'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { CategoryImportConfig } from './ImportTypes'

/**
 * JSONインポート全体を統括するComposable（ファイル・サーバー両対応）
 */
export const useJsonImporter = () => {
  const omikujiStore = useOmikujiStore()

  // 各機能のComposable
  const fileLoader = useJsonFileLoader()
  const serverLoader = useJsonServerLoader()
  const previewManager = useImportPreviewManager()

  // 内部状態
  const importedJsonData = ref<OmikujiDataType | null>(null)
  const currentDataSource = ref<'file' | 'server' | null>(null)

  // ファイル選択処理
  const handleFileSelection = async (event: Event) => {
    const data = await fileLoader.loadJsonFromFile(event)
    if (data) {
      importedJsonData.value = data
      currentDataSource.value = 'file'
      return data
    }
    return null
  }

  // サーバーからの読み込み処理
  const handleServerLoad = async (url: string) => {
    const data = await serverLoader.loadJsonFromServer(url)
    if (data) {
      importedJsonData.value = data
      currentDataSource.value = 'server'
      return data
    }
    return null
  }

  // プレビュー生成
  const createImportPreview = (currentData: OmikujiDataType) => {
    if (!importedJsonData.value) return null
    return previewManager.generatePreview(currentData, importedJsonData.value)
  }

  // インポート実行
  const executeDataImport = (): boolean => {
    if (!importedJsonData.value || !previewManager.previewData.value) return false
    return omikujiStore.mergeDataSets(importedJsonData.value, previewManager.previewData.value)
  }

  // グローバルインポートモードの設定
  const setGlobalImportMode = (mode: 'full' | 'partial') => {
    previewManager.setGlobalImportMode(mode)
  }

  // カテゴリ設定の更新
  const updateImportCategoryConfig = (category: CategoryType, config: Partial<CategoryImportConfig>) => {
    previewManager.updateCategorySettings(category, config)
  }

  // 全体リセット
  const resetImportProcess = () => {
    importedJsonData.value = null
    currentDataSource.value = null
    previewManager.clearPreview()
    fileLoader.resetFileLoader()
    serverLoader.resetServerLoader()
  }

  // 計算されたプロパティ
  const hasImportedData = computed(() => !!importedJsonData.value)
  const isImportReady = computed(() => hasImportedData.value && previewManager.hasPreviewData.value)
  const isLoading = computed(() => fileLoader.isFileLoading.value || serverLoader.isServerLoading.value)
  const loadError = computed(() => fileLoader.fileLoadError.value || serverLoader.serverLoadError.value)

  return {
    // File Loader
    fileInputRef: fileLoader.fileInputRef,
    openFileDialog: fileLoader.openFileDialog,

    // Server Loader
    loadJsonFromServer: serverLoader.loadJsonFromServer,
    loadPresetTemplate: serverLoader.loadPresetTemplate,

    // Preview Manager
    previewData: previewManager.previewData,
    enabledCategories: previewManager.enabledCategories,

    // Internal State
    importedJsonData,
    currentDataSource,

    // Computed
    hasImportedData,
    isImportReady,
    isLoading,
    loadError,

    // Actions
    handleFileSelection,
    handleServerLoad,
    createImportPreview,
    executeDataImport,
    setGlobalImportMode,
    updateImportCategoryConfig,
    resetImportProcess,
  }
}
