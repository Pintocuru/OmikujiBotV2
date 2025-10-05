// src/ConfigMaker/components/scriptGame/GameScriptsMap.ts
import { ScriptPreset } from '@/types/'
import BomberSpin from '@/GameScripts/BomberSpin/src/main'
import GouseiSuika from '@/GameScripts/GouseiSuika/src/main'
import DwarfBomb from '@/GameScripts/DwarfBomb/src/main'
import GoogolClover from '@/GameScripts/GoogolClover/main'

// gameScriptMap
export const gameScriptMap: Record<string, ScriptPreset<any, any, any>> = {
  [BomberSpin.key]: BomberSpin,
  [GouseiSuika.key]: GouseiSuika,
  [DwarfBomb.key]: DwarfBomb,
  [GoogolClover.key]: GoogolClover,
  // GachaOmikuji,
  // StealEmAll
} as const

// 自動的にキー一覧と型を抽出（TypeScriptのみ）
export const scriptGameKeys = Object.keys(gameScriptMap)
export type ScriptGameKey = keyof typeof gameScriptMap
