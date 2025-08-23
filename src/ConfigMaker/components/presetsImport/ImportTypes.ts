// src\ConfigMaker\components\presetsImport\ImportTypes.ts
import { CategoryType } from '@/types/OmikujiData/CategoryType'

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
  recordCategories: Record<CategoryType, CategoryImportConfig> // Record型カテゴリのみ
  totalItems: number
  importMode: 'full' | 'partial'
}
