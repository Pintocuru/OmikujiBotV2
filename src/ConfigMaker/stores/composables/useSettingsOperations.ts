// src/ConfigMaker/script/stores/composables/useSettingsOperations.ts
import { Ref } from 'vue';
import { OmikujiDataType, DisplaySettingsType, WordPartySettings, ScriptSettings } from '@/types/';

/**
 * カテゴリに属さないプロパティ（displaySettings, wordPartySettings, scriptSettings）
 * の操作機能を提供するコンポーザブル
 */
export function useSettingsOperations(data: Ref<OmikujiDataType>, markAsChanged: () => void) {
 /**
  * displaySettingsを更新する関数
  * オブジェクト全体を上書きまたは部分的に更新します。
  */
 const updateDisplaySettings = (updates: Partial<DisplaySettingsType>) => {
  // 既存の設定をコピーし、新しい値で上書きする
  data.value.displaySettings = { ...data.value.displaySettings, ...updates };
  markAsChanged();
 };

 /**
  * scriptSettingsを更新する関数
  * オブジェクト全体を上書きまたは部分的に更新します。
  */
 const updateScriptSettings = (updates: Partial<ScriptSettings>) => {
  // 既存の設定をコピーし、新しい値で上書きする
  data.value.scriptSettings = { ...data.value.scriptSettings, ...updates };
  markAsChanged();
 };

 /**
  * wordPartySettingsを更新する関数
  * 配列全体を上書きします。
  * @param newSettings WordPartySettingsの新しい配列
  */
 const updateWordPartySettings = (newSettings: WordPartySettings[]) => {
  // 配列全体を新しい値で上書きする
  data.value.wordPartySettings = newSettings;
  markAsChanged();
 };

 return {
  updateDisplaySettings,
  updateScriptSettings,
  updateWordPartySettings
 };
}
