// src/ConfigMaker/script/stores/composables/useSettingsOperations.ts
import { Ref } from 'vue';
import { OmikujiDataType, DisplaySettingsType, WordPartySettings, ScriptSettings } from '@/types/';
import { PackageMetaType } from '@shared/types';

/**
 * カテゴリに属さないプロパティ（displaySettings, wordPartySettings, scriptSettings）
 * の操作機能を提供するコンポーザブル
 */
export function useSettingsOperations(data: Ref<OmikujiDataType>) {
 // scriptSettingsを更新する関数
 const updateScriptSettings = (updates: Partial<ScriptSettings>) => {
  data.value.scriptSettings = { ...data.value.scriptSettings, ...updates };
 };

 // displaySettingsを更新する関数
 const updateDisplaySettings = (updates: Partial<DisplaySettingsType>) => {
  data.value.displaySettings = { ...data.value.displaySettings, ...updates };
 };

 // wordPartySettingsを更新する関数
 const updateWordPartySettings = (newSettings: WordPartySettings[]) => {
  data.value.wordPartySettings = newSettings;
 };

 // wordPartySettingsを更新する関数
 const updateMeta = (newSettings: PackageMetaType) => {
  data.value.meta = newSettings;
 };

 return {
  updateDisplaySettings,
  updateScriptSettings,
  updateWordPartySettings,
  updateMeta
 };
}
