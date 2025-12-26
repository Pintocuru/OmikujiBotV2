// src/ConfigMaker/script/stores/composables/useSettingsOperations.ts
import { Ref } from 'vue'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { DisplaySettingsType } from '@/types/OmikujiData/DisplaySettingsSchema'
import { MetaDataType } from '@shared/types'
import { JsonMergeType } from '@/types/OmikujiData/JsonMergeType'
import { ComponentsType, FeatureUsageType, SettingsComponentsCondition, SettingsType } from '@/types'

/**
 * カテゴリに属さないプロパティ（displaySettings, wordPartySettings, scriptSettings）
 * の操作機能を提供するコンポーザブル
 */
export function useSettingsOperations(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  // jsonMerge を更新する関数
  const updateJsonMerge = (newMerge: JsonMergeType) => {
    data.value.jsonMerge = newMerge
    hasChanged.value = true
  }
  // components を更新
  const updateComponentsConditions = (newConditions: SettingsComponentsCondition[]) => {
    data.value.components.conditions = newConditions
    hasChanged.value = true
  }

  // components のネスト更新
  const updateNestedComponents = <T extends keyof ComponentsType>(key: T, updates: Partial<ComponentsType[T]>) => {
    data.value.components[key] = {
      ...data.value.components[key],
      ...updates,
    } as ComponentsType[T]
    hasChanged.value = true
  }

  // featureUsage を更新
  const updateFeatureUsage = (updates: Partial<FeatureUsageType>) => {
    data.value.featureUsage = { ...data.value.featureUsage, ...updates }
    hasChanged.value = true
  }

  // featureUsage のネスト更新
  const updateNestedFeatureUsage = <T extends keyof FeatureUsageType>(
    key: T,
    updates: Partial<FeatureUsageType[T]>
  ) => {
    data.value.featureUsage[key] = {
      ...data.value.featureUsage[key],
      ...updates,
    } as FeatureUsageType[T]
    hasChanged.value = true
  }

  // settings を更新
  const updateSettings = (updates: Partial<SettingsType>) => {
    data.value.settings = { ...data.value.settings, ...updates }
    hasChanged.value = true
  }

  return {
    updateJsonMerge,
    updateComponentsConditions,
    updateNestedComponents,
    updateFeatureUsage,
    updateNestedFeatureUsage,
    updateSettings,
  }
}
