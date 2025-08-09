// 🔴 src/ConfigMaker/script/useScriptSettingsStore.ts
//
// omikujiStoreのメソッドを使うように修正
//
import { computed } from 'vue';
import { DefaultTypes } from '@shared/types';
import { useOmikujiStore } from './useOmikujiStore';
import { defineStore } from 'pinia';

export const useScriptSettingsStore = defineStore('scriptSettings', () => {
 const omikujiStore = useOmikujiStore();
 const scriptSettings = computed(() => omikujiStore.getCategoryMap('scriptSettings'));
 const scriptList = computed(() => Object.keys(scriptSettings.value));
 const scriptCount = computed(() => scriptList.value.length);

 const addScript = (scriptId: string, settings: Record<string, any> = {}) => {
  omikujiStore.addItem('scriptSettings', scriptId, settings);
 };

 const updateScript = (scriptId: string, settings: Record<string, any>) => {
  omikujiStore.updateItem('scriptSettings', scriptId, settings);
 };

 const removeScript = (scriptId: string) => {
  omikujiStore.removeItem('scriptSettings', scriptId);
 };

 const getScript = (scriptId: string) => {
  return scriptSettings.value[scriptId];
 };

 const addScriptSetting = (scriptId: string, key: string, value: any) => {
  const currentSettings = scriptSettings.value[scriptId] || {};
  const newSettings = { ...currentSettings, [key]: value };
  omikujiStore.updateItem('scriptSettings', scriptId, newSettings);
 };

 const removeScriptSetting = (scriptId: string, key: string) => {
  const currentSettings = {
   ...(scriptSettings.value[scriptId] as DefaultTypes)
  };
  delete currentSettings[key];
  omikujiStore.updateItem('scriptSettings', scriptId, currentSettings);
 };

 const updateScriptSetting = (scriptId: string, key: string, value: any) => {
  const currentSettings = {
   ...(scriptSettings.value[scriptId] as DefaultTypes)
  };
  currentSettings[key] = value;
  omikujiStore.updateItem('scriptSettings', scriptId, currentSettings);
 };

 const duplicateScript = (scriptId: string) => {
  return omikujiStore.duplicateItem('scriptSettings', scriptId);
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
  return { isValid: errors.length === 0, errors };
 };

 const updateItem = (
  category: 'scriptSettings',
  scriptId: string,
  settings: Record<string, any>
 ) => {
  omikujiStore.updateItem(category, scriptId, settings);
 };

 return {
  data: omikujiStore.data,
  scriptSettings,
  scriptList,
  scriptCount,
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
  updateItem
 };
});
