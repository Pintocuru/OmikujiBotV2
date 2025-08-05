// scriptGame/ScriptGameMap.ts
import { computed } from 'vue';
import { ScriptPreset } from '@/types/';
import BomberSpin from '@/GameScripts/BomberSpin/src/main';
import GouseiSuika from '@/GameScripts/GouseiSuika/src/main';
import DwarfBomb from '@/GameScripts/DwarfBomb/src/main';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { storeToRefs } from 'pinia';

// gameScriptMap
export const gameScriptMap: Record<string, ScriptPreset<any, any, any>> = {
 BomberSpin,
 GouseiSuika,
 DwarfBomb
 // GachaOmikuji,
 // StealEmAll
} as const;

// 自動的にキー一覧と型を抽出（TypeScriptのみ）
export const scriptGameKeys = Object.keys(gameScriptMap);
export type ScriptGameKey = keyof typeof gameScriptMap;

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// enabledScriptsをcomputedプロパティとして定義
export const enabledGameScriptMap = computed(() => {
 const { availableGameScripts } = data.value.displaySettings.developer;
 return Object.entries(gameScriptMap)
  .filter(([scriptId]) => availableGameScripts.includes(scriptId))
  .map(([, scriptPreset]) => scriptPreset);
});
