// src/ConfigMaker/components/KeyEditor/composables/keyUpdateStrategies.ts
import { RecordCategoryType, eventCategoryLabel, EventCategoryType } from '@/types/OmikujiData/'
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
const baseStrategies = Object.fromEntries(
  eventCategoryLabel.map((key) => [
    key,
    {
      updateKey: (oldKey: string, newKey: string) => updateRecordKey(key, oldKey, newKey),
    },
  ])
) as Record<EventCategoryType, KeyUpdateStrategy>

export const updateStrategies: Record<RecordCategoryType, KeyUpdateStrategy> = {
  ...baseStrategies,
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
