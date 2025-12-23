// src\ConfigMaker\components\parts\KeyEditor\keyEditorTypes.ts
import { RecordCategoryType } from '@/types/'

export type CharacterUsage = {
  comments: string[]
  timers: string[]
}

export type UpdateResult = {
  success: boolean
  error?: string
}

export interface KeyUpdateStrategy<T extends RecordCategoryType> {
  updateKey(oldKey: string, newKey: string): boolean
  updateReferences?(oldKey: string, newKey: string): void
}

export const CATEGORY_TITLES: Record<RecordCategoryType, string> = {
  comments: 'コメントルール',
  timers: 'タイマールール',
  actionSets: 'アクションセット',
  characters: 'キャラクター',
  placeholders: 'プレースホルダー',
} as const

export const ITEM_TYPE_LABELS: Record<RecordCategoryType, string> = {
  characters: 'キャラクター',
  placeholders: 'プレースホルダー',
  actionSets: 'アクションセット',
  comments: 'コメントルール',
  timers: 'タイマールール',
} as const
