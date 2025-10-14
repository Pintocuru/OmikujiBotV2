// src/ConfigMaker/script/stores/composables/useSettingsOperations.ts
import { Ref } from 'vue'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { DisplaySettingsType } from '@/types/OmikujiData/DisplaySettingsSchema'
import { WordPartySettings } from '@/types/OmikujiData/WordPartySettings'
import { ScriptSettingsType } from '@/types/GameScript/GameScriptSettingsSchema'
import { MetaDataType } from '@shared/types'
import { JsonMergeType } from '@/types/OmikujiData/JsonMergeType'

/**
 * カテゴリに属さないプロパティ（displaySettings, wordPartySettings, scriptSettings）
 * の操作機能を提供するコンポーザブル
 */
export function useSettingsOperations(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  // scriptSettingsを更新する関数
  const updateScriptSettings = (updates: Partial<ScriptSettingsType>) => {
    data.value.scriptSettings = { ...data.value.scriptSettings, ...updates } as ScriptSettingsType
    hasChanged.value = true
  }

  // displaySettings を更新する関数
  const updateDisplaySettings = (updates: Partial<DisplaySettingsType>) => {
    data.value.displaySettings = { ...data.value.displaySettings, ...updates }
    hasChanged.value = true
  }

  // displaySettings のネストされたプロパティを安全に更新する汎用関数
  const updateNestedDisplaySettings = <T extends keyof Omit<DisplaySettingsType, 'licenseKeyHash'>>(
    key: T,
    updates: Partial<DisplaySettingsType[T]>
  ) => {
    data.value.displaySettings[key] = {
      ...data.value.displaySettings[key],
      ...updates,
    } as DisplaySettingsType[T]
    hasChanged.value = true
  }

  // wordPartySettingsを更新する関数
  const updateWordPartySettings = (newSettings: WordPartySettings[]) => {
    data.value.wordPartySettings = newSettings
    hasChanged.value = true
  }

  // meta を更新する関数
  const updateMeta = (newSettings: MetaDataType) => {
    data.value.meta = newSettings
    hasChanged.value = true
  }

  // jsonMerge を更新する関数
  const updateJsonMerge = (newMerge: JsonMergeType) => {
    data.value.jsonMerge = newMerge
    hasChanged.value = true
  }

  return {
    updateScriptSettings,
    updateDisplaySettings,
    updateNestedDisplaySettings,
    updateWordPartySettings,
    updateMeta,
    updateJsonMerge,
  }
}
