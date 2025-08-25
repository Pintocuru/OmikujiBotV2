// src/ConfigMaker/script/stores/composables/useSettingsOperations.ts
import { Ref } from 'vue'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { DisplaySettingsType } from '@/types/OmikujiData/DisplaySettingsSchema'
import { WordPartySettings } from '@/types/OmikujiData/WordPartySettings'
import { ScriptSettingsType } from '@/types/GameScript/GameScriptSettingsSchema'
import { PackageMetaType } from '@shared/types'

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

  // displaySettingsを更新する関数
  const updateDisplaySettings = (updates: Partial<DisplaySettingsType>) => {
    data.value.displaySettings = { ...data.value.displaySettings, ...updates }
    hasChanged.value = true
  }

  // wordPartySettingsを更新する関数
  const updateWordPartySettings = (newSettings: WordPartySettings[]) => {
    data.value.wordPartySettings = newSettings
    hasChanged.value = true
  }

  // wordPartySettingsを更新する関数
  const updateMeta = (newSettings: PackageMetaType) => {
    data.value.meta = newSettings
    hasChanged.value = true
  }

  return {
    updateDisplaySettings,
    updateScriptSettings,
    updateWordPartySettings,
    updateMeta,
  }
}
