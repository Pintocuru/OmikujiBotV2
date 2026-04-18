// src/ConfigMaker/components/postAction/ActionSet/useWeightValueManagement.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  WeightValueType,
  WeightValueSchema,
  handelNormalizedValues,
  WeightValuesArrayType,
} from '@/types/OmikujiData/PlaceholderSchema'
import { useWeightCalculation } from '@config/components/events/composables/useWeightCalculation'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { checkCircularReference } from '@main/scripts/OmikujiProcess/ActionSetValidator'

/**
 * 重み付き値を管理するコンポーザブル
 * ActionSetとPlaceholder両方で使用可能
 */
export function useWeightValueManagement(values: () => WeightValuesArrayType, currentKey?: () => string | undefined) {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 正規化（string → WeightValueType）
  const displayValues = computed(() => handelNormalizedValues(values()))

  // weight 計算
  const { getWeightPercentage } = useWeightCalculation(displayValues)

  // アクションセット一覧（ActionSet用）
  const availableActionSets = computed(() => {
    if (!data.value?.actionSets) return []

    const current = currentKey?.()

    return Object.entries(data.value.actionSets).map(([key, actionSet]) => {
      const circularPath = checkCircularReference(key, data.value.actionSets, current)

      return {
        key,
        name: actionSet.name || key,
        disabled: circularPath !== null || key === current,
        circularPath,
      }
    })
  })

  // 値の追加
  const addValue = (emitUpdate: (values: WeightValuesArrayType) => void) => {
    const newValue = WeightValueSchema.parse({})
    emitUpdate([...values(), newValue])
  }

  // 値の削除
  const removeValue = (index: number, emitUpdate: (values: WeightValuesArrayType) => void) => {
    const updated = values().filter((_, i) => i !== index)
    emitUpdate(updated)
  }

  // 値の複製
  const duplicateValue = (index: number, emitUpdate: (values: WeightValuesArrayType) => void) => {
    const original = values()[index]
    let duplicated: string | WeightValueType

    if (typeof original === 'string') {
      duplicated = original
    } else {
      duplicated = { ...original }
    }

    const updated = [...values()]
    updated.splice(index + 1, 0, duplicated)
    emitUpdate(updated)
  }

  // 重み更新
  const updateWeight = (index: number, event: Event, emitUpdate: (values: WeightValuesArrayType) => void) => {
    const weight = parseInt((event.target as HTMLInputElement).value) || 1
    updateValue(index, { weight }, emitUpdate)
  }

  // content 更新
  const updateContent = (index: number, event: Event, emitUpdate: (values: WeightValuesArrayType) => void) => {
    const content = (event.target as HTMLInputElement).value || (event.target as HTMLSelectElement).value
    updateValue(index, { content }, emitUpdate)
  }

  // 値の更新（string → object 変換含む）
  const updateValue = (
    index: number,
    updates: Partial<WeightValueType>,
    emitUpdate: (values: WeightValuesArrayType) => void
  ) => {
    const updated = [...values()]
    const current = updated[index]

    if (typeof current === 'string') {
      updated[index] = { content: current, weight: 1, ...updates }
    } else {
      updated[index] = { ...current, ...updates }
    }

    emitUpdate(updated)
  }

  // 循環参照チェック（ActionSet用）
  const isCircular = (key: string) => {
    if (!key || !data.value?.actionSets) return false
    const current = currentKey?.()
    return checkCircularReference(key, data.value.actionSets, current) !== null
  }

  const getCircularPath = (key: string) => {
    if (!key || !data.value?.actionSets) return ''
    const current = currentKey?.()
    const path = checkCircularReference(key, data.value.actionSets, current)
    if (!path) return ''
    return path.map((k) => data.value?.actionSets[k]?.name || k).join(' → ')
  }

  return {
    displayValues,
    getWeightPercentage,
    availableActionSets,
    addValue,
    removeValue,
    duplicateValue,
    updateWeight,
    updateContent,
    updateValue,
    isCircular,
    getCircularPath,
  }
}
