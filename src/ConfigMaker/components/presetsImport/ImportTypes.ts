// src/ConfigMaker/components/presetsImport/ImportTypes.ts
import { UiKind } from '@/types'
import { RecordCategoryType } from '@/types/OmikujiData/'

export type ImportMode = 'full-replace' | 'partial-replace' | 'partial-merge'

export interface ConflictInfo {
  key: string
  name: string
}

export interface CategoryImportConfig {
  enabled: boolean
  mode: ImportMode
  count: number
  conflicts: ConflictInfo[]
}

export interface ComponentImportConfig {
  enabled: boolean
  useImported: boolean // true: 読み込み側を使用, false: 既存を使用
}

export interface ImportPreview {
  recordCategories: Record<RecordCategoryType, CategoryImportConfig>
  componentConfigs: Record<UiKind, ComponentImportConfig>
  totalItems: number
}
