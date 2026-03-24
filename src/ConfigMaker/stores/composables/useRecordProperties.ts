// src/ConfigMaker/stores/composables/useRecordProperties.ts
import { Ref } from 'vue'
import { WeightValuesArraySchema, WeightValuesArrayType } from '@/types/OmikujiData/PlaceholderSchema'
import { EventCategoryType, EventType } from '@/types/OmikujiData/'
import type { useRecordCRUD } from './useRecordCRUD'
import {
  OmikujiDataType,
  OmikujiItemType,
  PostFlowType,
  RecordCategoryItemTypeMap,
  RecordCategoryType,
} from '@/types/OmikujiData'

/**
 * レコード型アイテムのプロパティ更新機能を提供
 * 汎用的な更新と特殊ケースの更新を含む
 */
export function useRecordProperties(data: Ref<OmikujiDataType>, recordCRUD: ReturnType<typeof useRecordCRUD>) {
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
    category: EventCategoryType,
    eventKey: string,
    omikujiIndex: number,
    updater: (item: OmikujiItemType) => OmikujiItemType
  ) => {
    const record = data.value[category]?.[eventKey] as EventType
    if (!record?.omikuji?.[omikujiIndex]) return

    const updated = [...record.omikuji]
    updated[omikujiIndex] = updater(updated[omikujiIndex])

    updateRecordProperty(category, eventKey, 'omikuji', updated)
  }

  // 特殊ケース: おみくじのpostActions更新
  const updateOmikujiPostActions = (
    category: EventCategoryType,
    eventKey: string,
    omikujiIndex: number,
    postActions: PostFlowType[]
  ) => {
    const record = data.value[category]?.[eventKey] as EventType
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

    updateRecordProperty(category, eventKey, 'omikuji', updatedOmikuji)
  }

  // 特殊ケース: プレースホルダー値の更新
  const updatePlaceholderValues = (placeholderKey: string, rawValues: WeightValuesArrayType) => {
    if (data.value.placeholders[placeholderKey]) {
      const parsedValues = WeightValuesArraySchema.parse(rawValues)
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
