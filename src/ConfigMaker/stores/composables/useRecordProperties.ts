// src/ConfigMaker/script/stores/composables/useRecordProperties.ts
import { Ref } from 'vue'
import { RecordCategoryType, RecordCategoryItemTypeMap } from '@/types/OmikujiData/CategoryType'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { OmikujiItemType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { PlaceholderValuesSchema, PlaceholderValueType } from '@/types/OmikujiData/PlaceholderSchema'
import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'
import type { useRecordCRUD } from './useRecordCRUD'
import type { useRecordDataAccess } from './useRecordDataAccess'

/**
 * レコード型アイテムのプロパティ更新機能を提供
 * 汎用的な更新と特殊ケースの更新を含む
 */
export function useRecordProperties(
  data: Ref<OmikujiDataType>,
  recordCRUD: ReturnType<typeof useRecordCRUD>,
  recordDataAccess: ReturnType<typeof useRecordDataAccess>
) {
  // 汎用プロパティ更新
  const updateRecordProperty = <C extends RecordCategoryType, K extends keyof RecordCategoryItemTypeMap[C]>(
    category: C,
    key: string,
    propertyKey: K,
    value: RecordCategoryItemTypeMap[C][K]
  ) => {
    recordCRUD.updateItem(category, key, {
      [propertyKey]: value,
    } as unknown as Partial<RecordCategoryItemTypeMap[C]>)
  }

  // 特殊ケース: おみくじのitem更新
  const updateOmikujiByIndex = (
    category: RulesCategoryType,
    ruleKey: string,
    omikujiIndex: number,
    updater: (item: OmikujiItemType) => OmikujiItemType
  ) => {
    const record = recordDataAccess.getItem(category, ruleKey) as RuleType
    if (!record?.omikuji?.[omikujiIndex]) return

    const updated = [...record.omikuji]
    updated[omikujiIndex] = updater(updated[omikujiIndex])

    updateRecordProperty(category, ruleKey, 'omikuji', updated)
  }

  // 特殊ケース: おみくじのpostActions更新
  const updateOmikujiPostActions = (
    category: RulesCategoryType,
    ruleKey: string,
    omikujiIndex: number,
    postActions: PostActionType[]
  ) => {
    const record = recordDataAccess.getItem(category, ruleKey) as RuleType
    if (!record?.omikuji?.[omikujiIndex]) {
      console.error('指定されたおみくじが見つかりません')
      return
    }

    const updatedOmikuji = [...record.omikuji]
    updatedOmikuji[omikujiIndex] = {
      ...updatedOmikuji[omikujiIndex],
      // delaySeconds 順に並べる
      postActions: postActions.sort((a, b) => a.delaySeconds - b.delaySeconds),
    }

    updateRecordProperty(category, ruleKey, 'omikuji', updatedOmikuji)
  }

  // 特殊ケース: プレースホルダー値の更新
  const updatePlaceholderValues = (placeholderKey: string, rawValues: Array<PlaceholderValueType | string>) => {
    if (data.value.placeholders[placeholderKey]) {
      const parsedValues = PlaceholderValuesSchema.parse(rawValues)
      updateRecordProperty('placeholders', placeholderKey, 'values', parsedValues)
    }
  }

  return {
    updateRecordProperty,
    updateOmikujiByIndex,
    updateOmikujiPostActions,
    updatePlaceholderValues,
  }
}
