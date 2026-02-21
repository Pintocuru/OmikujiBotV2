// src/GameScripts/GameScriptsMap.ts
import { ScriptPreset } from '@/types/'
import BomberSpin from './scripts/BomberSpin/main'
import GouseiSuika from './scripts/GouseiSuika/main'
import DwarfBomb from './scripts/DwarfBomb/main'
import GoogolClover from './scripts/GoogolClover/main'
import MultiplyBonanza from './scripts/MultiplyBonanza/main'
import HugEmAll from './scripts/HugEmAll/main'
import WinnerGroup from './scripts/WinnerGroup/main'

// gameScriptMap
export const gameScriptMap = {
  GouseiSuika: GouseiSuika,
  BomberSpin: BomberSpin,
  DwarfBomb: DwarfBomb,
  MultiplyBonanza: MultiplyBonanza,
  GoogolClover: GoogolClover,
  HugEmAll: HugEmAll,
  WinnerGroup: WinnerGroup,
} satisfies Record<string, ScriptPreset>

// 自動的にキー一覧と型を抽出（TypeScriptのみ）
export const scriptGameKeys = Object.keys(gameScriptMap)
export type ScriptGameKey = keyof typeof gameScriptMap
