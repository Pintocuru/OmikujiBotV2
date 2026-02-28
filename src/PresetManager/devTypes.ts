// src/PresetManager/devTypes.ts
import { Ref } from 'vue'

export interface DevConfigStateType {
  saveFileName: Ref<string>
  availableFiles: Ref<FileItem[]>
  isExpressMode: Ref<boolean>
  isSaving: Ref<boolean>
  isLoading: Ref<boolean>
  isDeleting: Ref<boolean>
  isLoadingFileList: Ref<boolean>
  isExecutingConfirm: Ref<boolean>
  isServerConnected: Ref<boolean>
  isDeletingFileMap: Map<string, boolean>
}

export interface FileItem {
  name: string // "category/file.json" （APIからの値）
  displayName: string // "file.json" （表示用）
  folder: string | null // "category" or null
  modified: string
}

export interface DevConfigsState {
  // ファイル関連
  saveFileName: string
  availableFiles: FileItem[]

  // ローディング状態
  isSaving: boolean
  isLoading: boolean
  isDeleting: boolean
  isLoadingFileList: boolean
  isExecutingConfirm: boolean

  // 接続状態
  isServerConnected: boolean

  // 個別のファイル削除状態を管理
  isDeletingFileMap: Map<string, boolean>
}
