// src/ConfigMaker/stores/composables/useSettingsOperations.ts
import { Ref } from 'vue'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { JsonMergeType } from '@/types/OmikujiData/JsonMergeType'
import { ComponentsType, ComponentsConditions, ComponentsCommonStyle, FlagsType, SettingsType } from '@/types/'

/**
 * カテゴリに属さないプロパティの操作機能を提供するコンポーザブル
 */
export function useSettingsOperations(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  // jsonMerge を更新する関数
  const updateJsonMerge = (newMerge: JsonMergeType) => {
    data.value.jsonMerge = newMerge
    hasChanged.value = true
  }

  /**
   * components を更新
   */
  const updateComponents = (updates: Partial<ComponentsType>) => {
    data.value.components = {
      ...data.value.components,
      ...updates,
    }
    hasChanged.value = true
  }

  /**
   * v2.1: components.conditions を更新
   * スロットと種類の組み合わせ配列を更新
   */
  const updateComponentsConditions = (newConditions: ComponentsConditions) => {
    data.value.components.conditions = newConditions
    hasChanged.value = true
  }

  /**
   * v2.1: components.commonStyle を更新
   * 共通スタイル設定を更新
   */
  const updateComponentsCommonStyle = (updates: Partial<ComponentsCommonStyle>) => {
    data.value.components.commonStyle = {
      ...data.value.components.commonStyle,
      ...updates,
    }
    hasChanged.value = true
  }

  /**
   * v2.1: components.settings のネスト更新
   * 特定のコンポーネント設定を更新
   */
  const updateComponentSettings = <T extends keyof ComponentsType['settings']>(
    key: T,
    updates: Partial<ComponentsType['settings'][T]>
  ) => {
    data.value.components.settings[key] = {
      ...data.value.components.settings[key],
      ...updates,
    } as ComponentsType['settings'][T]
    hasChanged.value = true
  }

  // Flags 更新
  const updateFlags = (updates: Partial<FlagsType>) => {
    data.value.featureUsage = { ...data.value.featureUsage, ...updates }
    hasChanged.value = true
  }

  // featureUsage のネスト更新
  const updateFlagsNested = <T extends keyof FlagsType>(key: T, updates: Partial<FlagsType[T]>) => {
    data.value.featureUsage[key] = {
      ...data.value.featureUsage[key],
      ...updates,
    } as FlagsType[T]
    hasChanged.value = true
  }

  // featureUsage のarray
  const updateFlagsArray = <T extends keyof FlagsType>(key: T, value: FlagsType[T]) => {
    data.value.featureUsage[key] = value
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
    updateComponentsCommonStyle,
    updateComponentSettings,
    updateComponents,
    updateFlags,
    updateFlagsNested,
    updateFlagsArray,
    updateSettings,
  }
}
