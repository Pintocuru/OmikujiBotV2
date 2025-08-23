// src\ConfigMaker\components\presetsImport\ImportTypes.ts (修正版)
import { RecordCategoryType } from '@/types/OmikujiData/CategoryType'

//
export type JsonDataSource = 'file' | 'server'

// インポートモードを簡素化
export type ImportMode = 'full-replace' | 'partial-replace' | 'partial-merge'

// 競合情報を表すインターフェース
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

export interface ImportPreview {
  recordCategories: Record<RecordCategoryType, CategoryImportConfig> // Record型カテゴリのみに修正
  totalItems: number
  importMode: 'full' | 'partial'
}
