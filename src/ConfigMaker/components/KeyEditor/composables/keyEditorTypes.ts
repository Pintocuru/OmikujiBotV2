// src/ConfigMaker/components/KeyEditor/composables/keyEditorTypes.ts
import { RulesCategoryType } from '@/types/OmikujiData/'

export type CharacterUsage = { [K in RulesCategoryType]: string[] }
export type UpdateResult = {
  success: boolean
  error?: string
}

export interface KeyUpdateStrategy {
  updateKey(oldKey: string, newKey: string): boolean
  updateReferences?(oldKey: string, newKey: string): void
}
