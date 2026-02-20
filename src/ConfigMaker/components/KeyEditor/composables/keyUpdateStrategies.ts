// src/ConfigMaker/components/KeyEditor/composables/keyUpdateStrategies.ts
import { RecordCategoryType } from '@/types/OmikujiData/'
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
  comments: {
    updateKey: (oldKey, newKey) => updateRecordKey('comments', oldKey, newKey),
  },
  timers: {
    updateKey: (oldKey, newKey) => updateRecordKey('timers', oldKey, newKey),
  },
  metas: {
    updateKey: (oldKey, newKey) => updateRecordKey('metas', oldKey, newKey),
  },
  actionSets: {
    updateKey: (oldKey, newKey) => updateRecordKey('actionSets', oldKey, newKey),
    updateReferences: updateActionSetReferences,
  },
  placeholders: {
    updateKey: updatePlaceholderKey,
    updateReferences: updatePlaceholderReferences,
  },
  characters: {
    updateKey: updateCharacterKey,
    updateReferences: updateCharacterReferences,
  },
}
