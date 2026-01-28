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
  metas: 'メタルール',
  actionSets: 'アクションセット',
  placeholders: 'プレースホルダー',
  characters: 'キャラクター',
} as const
