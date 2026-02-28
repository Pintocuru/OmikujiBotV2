// src/PresetManager/stores/useDevConfigGetters.ts
import { computed } from 'vue'
import { DevConfigStateType } from '../devTypes'

export function useDevConfigGetters(state: DevConfigStateType) {
  // ソート済みファイル一覧
  const sortedFiles = computed(() => {
    return [...state.availableFiles.value].sort(
      (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
    )
  })

  // 特定ファイルの削除中状態
  const isDeletingFile = computed(() => (fileName: string) => {
    return state.isDeletingFileMap.get(fileName) || false
  })

  // 最新ファイル
  const latestFile = computed(() => {
    const files = state.availableFiles.value
    if (files.length === 0) return null
    return files.reduce((latest, current) =>
      new Date(current.modified) > new Date(latest.modified) ? current : latest
    )
  })

  // 統合ローディング状態
  const isAnyLoading = computed(() => {
    return (
      state.isSaving.value ||
      state.isLoading.value ||
      state.isDeleting.value ||
      state.isLoadingFileList.value ||
      state.isExecutingConfirm.value
    )
  })

  // ファイル数
  const fileCount = computed(() => state.availableFiles.value.length)

  // 名前でファイル検索
  const findFileByName = computed(() => (fileName: string) => {
    return state.availableFiles.value.find((file: { name: string }) => file.name === fileName)
  })

  return {
    sortedFiles,
    isDeletingFile,
    latestFile,
    isAnyLoading,
    fileCount,
    findFileByName,
  }
}
