// src\ConfigMaker\components\parts\KeyEditor\keyEditorTypes.ts
import { RecordCategoryType, RulesCategoryType } from '@/types/OmikujiData/'

export type CharacterUsage = { [K in RulesCategoryType]: string[] }
export type UpdateResult = {
  success: boolean
  error?: string
}

export interface KeyUpdateStrategy<T extends RecordCategoryType> {
  updateKey(oldKey: string, newKey: string): boolean
  updateReferences?(oldKey: string, newKey: string): void
}
