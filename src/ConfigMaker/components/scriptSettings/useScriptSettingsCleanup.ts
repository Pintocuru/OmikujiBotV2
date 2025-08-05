// src/configMaker/components/scriptSettings/useScriptSettingsCleanup.ts -->
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { gameScriptMap } from '@/ScriptGame/ScriptGameMap';
import { DefaultTypes } from '@shared/types';

export const useScriptSettingsCleanup = () => {
 const omikujiStore = useOmikujiStore();

 const cleanupScriptSettings = () => {
  const currentScriptSettings = { ...omikujiStore.data.scriptSettings };
  let hasChanges = false;

  for (const scriptId in currentScriptSettings as DefaultTypes) {
   if (!(scriptId in gameScriptMap)) {
    delete currentScriptSettings[scriptId];
    hasChanges = true;
    continue;
   }

   const scriptPreset = gameScriptMap[scriptId];
   const actualSettings = scriptPreset?.settings;

   if (!Array.isArray(actualSettings) || actualSettings.length === 0) {
    continue;
   }

   const validSettingIds = new Set(actualSettings.map((s) => s.key));

   const settings = currentScriptSettings[scriptId] as DefaultTypes;

   for (const settingId in settings) {
    if (!validSettingIds.has(settingId)) {
     delete settings[settingId];
     hasChanges = true;
    }
   }
  }

  if (hasChanges) omikujiStore.data.scriptSettings = currentScriptSettings;
 };

 return {
  cleanupScriptSettings
 };
};
