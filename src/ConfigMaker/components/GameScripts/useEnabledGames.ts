// src/ConfigMaker/components/scriptGame/useEnabledGames.ts
import { computed } from 'vue';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { storeToRefs } from 'pinia';
import { gameScriptMap } from './ScriptGameMap';

// コンポーザブル関数として定義
export function useEnabledGames() {
 const omikujiStore = useOmikujiStore();
 const { data } = storeToRefs(omikujiStore);

 const enabledGameScriptMap = computed(() => {
  const { availableGameScripts } = data.value.displaySettings.developer;
  return Object.entries(gameScriptMap)
   .filter(([scriptId]) => availableGameScripts.includes(scriptId))
   .map(([, scriptPreset]) => scriptPreset);
 });

 return { enabledGameScriptMap };
}
