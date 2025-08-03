// src/ConfigMaker/script/useScriptSettingsStore.ts
// スクリプト設定専用ストア
import { computed } from 'vue';
import { useOmikujiStore } from './useOmikujiStore';
import { defineStore } from 'pinia';
import { DefaultTypes } from '@type/';

export const useScriptSettingsStore = defineStore('scriptSettings', () => {
 const omikujiStore = useOmikujiStore();

 // Computed properties
 const scriptSettings = computed(() => omikujiStore.data.scriptSettings);
 const scriptList = computed(() => Object.keys(scriptSettings.value));
 const scriptCount = computed(() => scriptList.value.length);

 // Actions
 const addScript = (scriptId: string, settings: Record<string, any> = {}) => {
  omikujiStore.addItemToCategory('scriptSettings', scriptId, settings);
 };

 const updateScript = (scriptId: string, settings: Record<string, any>) => {
  omikujiStore.updateItemInCategory('scriptSettings', scriptId, settings);
 };

 const removeScript = (scriptId: string) => {
  omikujiStore.removeItemFromCategory('scriptSettings', scriptId);
 };

 const getScript = (scriptId: string) => {
  return scriptSettings.value[scriptId];
 };

 const addScriptSetting = (scriptId: string, key: string, value: any) => {
  const currentSettings = scriptSettings.value[scriptId] || {};
  const newSettings = { ...currentSettings, [key]: value };
  updateScript(scriptId, newSettings);
 };

 const removeScriptSetting = (scriptId: string, key: string) => {
  const currentSettings = {
   ...(scriptSettings.value[scriptId] as DefaultTypes)
  };
  delete currentSettings[key];
  updateScript(scriptId, currentSettings);
 };

 const updateScriptSetting = (scriptId: string, key: string, value: any) => {
  const currentSettings = {
   ...(scriptSettings.value[scriptId] as DefaultTypes)
  };
  currentSettings[key] = value;
  updateScript(scriptId, currentSettings);
 };

 const duplicateScript = (scriptId: string) => {
  const original = scriptSettings.value[scriptId];
  if (!original) return null;

  const newId = `${scriptId}_copy_${Date.now()}`;
  addScript(newId, { ...original });
  return newId;
 };

 const importScriptSettings = (data: Record<string, Record<string, any>>) => {
  Object.entries(data).forEach(([scriptId, settings]) => {
   addScript(scriptId, settings);
  });
 };

 const exportScriptSettings = () => {
  return JSON.stringify(scriptSettings.value, null, 2);
 };

 const validateScriptSettings = () => {
  const errors: string[] = [];

  Object.entries(scriptSettings.value).forEach(([scriptId, settings]) => {
   if (!scriptId.trim()) {
    errors.push('スクリプトIDが空です');
   }

   if (typeof settings !== 'object' || settings === null) {
    errors.push(`${scriptId}: 設定が正しい形式ではありません`);
   }
  });

  return {
   isValid: errors.length === 0,
   errors
  };
 };

 // ScriptSettingsEditor用の便利メソッド
 const updateItemInCategory = (
  category: 'scriptSettings',
  scriptId: string,
  settings: Record<string, any>
 ) => {
  omikujiStore.updateItemInCategory(category, scriptId, settings);
 };

 return {
  // State
  data: omikujiStore.data,
  scriptSettings,
  scriptList,
  scriptCount,

  // Actions
  addScript,
  updateScript,
  removeScript,
  getScript,
  addScriptSetting,
  removeScriptSetting,
  updateScriptSetting,
  duplicateScript,
  importScriptSettings,
  exportScriptSettings,
  validateScriptSettings,
  updateItemInCategory
 };
});
