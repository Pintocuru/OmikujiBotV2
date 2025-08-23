// stores/useImportStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CategoryType, recordCategoryLabel, RecordCategoryType } from '@/types/OmikujiData/CategoryType'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { CategoryImportConfig, ConflictInfo, ImportPreview } from './ImportTypes'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

export const useImportStore = defineStore('import', () => {
  // State
  const importedData = ref<OmikujiDataType | null>(null)
  const previewData = ref<ImportPreview | null>(null)
  const globalImportMode = ref<'full' | 'partial'>('partial')
  const isLoading = ref(false)
  const loadError = ref('')
  const showPreviewModal = ref(false)

  // Computed
  const hasImportedData = computed(() => !!importedData.value)
  const hasPreviewData = computed(() => !!previewData.value)
  const enabledCategories = computed(() => {
    if (!previewData.value) return []
    return Object.entries(previewData.value.recordCategories)
      .filter(([, config]) => config.enabled)
      .map(([category]) => category as CategoryType)
  })

  // Helper functions
  const getItemName = (item: any): string => {
    if (item && typeof item === 'object' && 'name' in item) {
      return item.name || ''
    }
    return ''
  }

  const checkRecordConflicts = (
    currentData: OmikujiDataType,
    importData: OmikujiDataType,
    category: CategoryType
  ): ConflictInfo[] => {
    const currentItems = currentData[category] ?? {}
    const importItems = importData[category] ?? {}

    if (typeof currentItems !== 'object' || typeof importItems !== 'object') {
      return []
    }

    const importKeys = Object.keys(importItems)
    const currentKeys = Object.keys(currentItems)
    const conflictKeys = importKeys.filter((key) => currentKeys.includes(key))

    return conflictKeys.map((key) => ({
      key,
      name: getItemName((importItems as any)[key]),
    }))
  }

  // Actions
  const loadFromFile = async (file: File): Promise<boolean> => {
    isLoading.value = true
    loadError.value = ''

    try {
      const text = await file.text()
      const jsonData = JSON.parse(text)
      const validatedData = OmikujiDataSchema.parse(jsonData)
      importedData.value = validatedData
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ファイル読み込みエラー'
      loadError.value = message
      return false
    } finally {
      isLoading.value = false
    }
  }

  const generatePreview = () => {
    if (!importedData.value) return null

    const omikujiStore = useOmikujiStore()
    const currentData = omikujiStore.data
    const validatedImportData = importedData.value

    const recordCategories: Record<CategoryType, CategoryImportConfig> = {} as any
    let totalItems = 0

    recordCategoryLabel.forEach((category) => {
      const importItems = validatedImportData[category] ?? {}
      const importCount = Object.keys(importItems).length
      const conflicts = checkRecordConflicts(currentData, validatedImportData, category)

      totalItems += importCount

      const isPartialTarget = recordCategoryLabel.includes(category)

      recordCategories[category] = {
        enabled: globalImportMode.value === 'full' ? true : isPartialTarget,
        mode: globalImportMode.value === 'full' ? 'full-replace' : 'partial-merge',
        count: importCount,
        conflicts,
      }
    })

    const preview = {
      recordCategories,
      totalItems,
      importMode: globalImportMode.value,
    }

    previewData.value = preview
    return preview
  }

  const setGlobalImportMode = (mode: 'full' | 'partial') => {
    globalImportMode.value = mode

    if (previewData.value) {
      Object.keys(previewData.value.recordCategories).forEach((categoryKey) => {
        const category = categoryKey as RecordCategoryType
        const config = previewData.value!.recordCategories[category]
        const isPartialTarget = recordCategoryLabel.includes(category)

        if (mode === 'full') {
          config.enabled = true
          config.mode = 'full-replace'
        } else {
          config.enabled = isPartialTarget
          config.mode = isPartialTarget ? 'partial-merge' : 'partial-replace'
        }
      })

      previewData.value.importMode = mode
    }
  }

  const updateCategoryConfig = (category: CategoryType, config: Partial<CategoryImportConfig>) => {
    if (!previewData.value?.recordCategories[category]) return

    previewData.value.recordCategories[category] = {
      ...previewData.value.recordCategories[category],
      ...config,
    }
  }

  const executeImport = (): boolean => {
    if (!importedData.value || !previewData.value) return false

    const omikujiStore = useOmikujiStore()
    const result = omikujiStore.mergeDataSets(importedData.value, previewData.value)

    if (result) {
      resetImportProcess()
    }

    return result
  }

  const openPreviewModal = () => {
    showPreviewModal.value = true
  }

  const closePreviewModal = () => {
    showPreviewModal.value = false
  }

  const resetImportProcess = () => {
    importedData.value = null
    previewData.value = null
    loadError.value = ''
    showPreviewModal.value = false
  }

  return {
    // State
    importedData,
    previewData,
    globalImportMode,
    isLoading,
    loadError,
    showPreviewModal,

    // Computed
    hasImportedData,
    hasPreviewData,
    enabledCategories,

    // Actions
    loadFromFile,
    generatePreview,
    setGlobalImportMode,
    updateCategoryConfig,
    executeImport,
    openPreviewModal,
    closePreviewModal,
    resetImportProcess,
  }
})
