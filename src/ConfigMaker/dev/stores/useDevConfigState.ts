// src/configMaker/dev/stores/useDevConfigState.ts
import { ref, reactive } from 'vue'
import { FileItem } from '../devTypes'

export function useDevConfigState() {
  // ファイル関連
  const saveFileName = ref('')
  const availableFiles = ref<FileItem[]>([])

  // ローディング状態
  const isSaving = ref(false)
  const isLoading = ref(false)
  const isDeleting = ref(false)
  const isLoadingFileList = ref(false)
  const isExecutingConfirm = ref(false)

  // サーバー接続状態
  const isServerConnected = ref(true)

  // 個別ファイル削除状態
  const isDeletingFileMap = reactive(new Map<string, boolean>())

  return {
    saveFileName,
    availableFiles,
    isSaving,
    isLoading,
    isDeleting,
    isLoadingFileList,
    isExecutingConfirm,
    isServerConnected,
    isDeletingFileMap,
  }
}
