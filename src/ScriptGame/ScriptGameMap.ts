// scriptGame/ScriptGameMap.ts
import { ScriptPreset } from '@type/';
import BomberSpin from '@/GameScripts/BomberSpin/src/main.js';
import GouseiSuika from '@/GameScripts/GouseiSuika/src/main.js';
import DwarfBomb from '@/GameScripts/DwarfBomb/src/main.js';
import GachaOmikuji from './GachaOmikuji.js';
import StealEmAll from './StealEmAll.js';

export const scriptGameMap: Record<string, ScriptPreset<any, any, any>> = {
 BomberSpin,
 GouseiSuika,
 DwarfBomb
 // GachaOmikuji,
 // StealEmAll
} as const;

// 自動的にキー一覧と型を抽出（TypeScriptのみ）
export const scriptGameKeys = Object.keys(scriptGameMap);
export type ScriptGameKey = keyof typeof scriptGameMap;
