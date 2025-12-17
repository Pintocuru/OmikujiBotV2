// src/ConfigMaker/components/scriptGame/GameScriptsMap.ts
import { ScriptPreset } from '@/types/'
import BomberSpin from './scripts/BomberSpin/main'
import GouseiSuika from './scripts/GouseiSuika/main'
import DwarfBomb from './scripts/DwarfBomb/main'
import GoogolClover from './scripts/GoogolClover/main'
import MultiplyBonanza from './scripts/MultiplyBonanza/main'

// gameScriptMap
export const gameScriptMap: Record<string, ScriptPreset> = {
  [GouseiSuika.key]: GouseiSuika,
  [BomberSpin.key]: BomberSpin,
  [DwarfBomb.key]: DwarfBomb,
  [MultiplyBonanza.key]: MultiplyBonanza,
  [GoogolClover.key]: GoogolClover,
  // GachaOmikuji,
  // StealEmAll
} as const

// 自動的にキー一覧と型を抽出（TypeScriptのみ）
export const scriptGameKeys = Object.keys(gameScriptMap)
export type ScriptGameKey = keyof typeof gameScriptMap
