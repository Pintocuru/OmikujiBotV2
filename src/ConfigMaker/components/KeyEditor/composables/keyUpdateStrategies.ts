// src\ConfigMaker\components\parts\useKeyEditor\keyUpdateStrategies.ts
import { RecordCategoryType } from '@/types/OmikujiData/CategoryType'
import { KeyUpdateStrategy } from './keyEditorTypes'
import { updateRecordKey, updateCharacterKey, updatePlaceholderKey } from './keyUpdateCore'
import {
  updateCharacterReferences,
  updatePlaceholderReferences,
  updateActionSetReferences,
} from './keyUpdateReferences'

/**
 * Key更新戦略マップ
 * すべてのRecordCategoryTypeに対応（BaseRecordSchema準拠）
 */
export const updateStrategies: Record<RecordCategoryType, KeyUpdateStrategy<RecordCategoryType>> = {
  characters: {
    updateKey: updateCharacterKey,
    updateReferences: updateCharacterReferences,
  },
  placeholders: {
    updateKey: updatePlaceholderKey,
    updateReferences: updatePlaceholderReferences,
  },
  actionSets: {
    updateKey: (oldKey, newKey) => updateRecordKey('actionSets', oldKey, newKey),
    updateReferences: updateActionSetReferences,
  },
  comments: {
    updateKey: (oldKey, newKey) => updateRecordKey('comments', oldKey, newKey),
  },
  timers: {
    updateKey: (oldKey, newKey) => updateRecordKey('timers', oldKey, newKey),
  },
}
