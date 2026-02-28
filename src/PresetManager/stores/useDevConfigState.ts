// src/PresetManager/stores/useDevConfigState.ts
import { ref, reactive } from 'vue'
import { FileItem } from '../devTypes'
import { isDev } from '@/types'

export function useDevConfigState() {
  // ファイル関連
  const saveFileName = ref('')
  const availableFiles = ref<FileItem[]>([])

  // APIモード（開発環境ではExpressモードがデフォルト、本番環境ではPluginのみ）
  const isExpressMode = ref(isDev)

  // ローディング状態
  const isSaving = ref(false)
  const isLoading = ref(false)
  const isDeleting = ref(false)
  const isLoadingFileList = ref(false)
  const isExecutingConfirm = ref(false)

  // サーバー接続状態
  const isServerConnected = ref(false)

  // 個別ファイル削除状態
  const isDeletingFileMap = reactive(new Map<string, boolean>())

  return {
    saveFileName,
    availableFiles,
    isExpressMode,
    isSaving,
    isLoading,
    isDeleting,
    isLoadingFileList,
    isExecutingConfirm,
    isServerConnected,
    isDeletingFileMap,
  }
}
