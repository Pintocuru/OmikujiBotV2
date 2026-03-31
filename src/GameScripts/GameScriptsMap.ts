// src/GameScripts/GameScriptsMap.ts
import { ScriptClass, ScriptGameKey } from '@/types'
import GouseiSuikaExecute from './scripts/GouseiSuika/execute'
import BomberSpinExecute from './scripts/BomberSpin/execute'
import DwarfBombExecute from './scripts/DwarfBomb/execute'
import MultiplyBonanzaExecute from './scripts/MultiplyBonanza/execute'
import GoogolCloverExecute from './scripts/GoogolClover/execute'
import HugEmAllExecute from './scripts/HugEmAll/execute'
import WinnerGroupExecute from './scripts/WinnerGroup/execute'

/**
 * ゲーム実行map
 */
export const gameExecuteMap: Record<ScriptGameKey, ScriptClass> = {
  GouseiSuika: GouseiSuikaExecute,
  BomberSpin: BomberSpinExecute,
  DwarfBomb: DwarfBombExecute,
  MultiplyBonanza: MultiplyBonanzaExecute,
  GoogolClover: GoogolCloverExecute,
  HugEmAll: HugEmAllExecute,
  WinnerGroup: WinnerGroupExecute,
}

/**

export const gameExecuteMap = {
  GouseiSuika: () => import('./scripts/GouseiSuika/execute'),
  BomberSpin: () => import('./scripts/BomberSpin/execute'),
  DwarfBomb: () => import('./scripts/DwarfBomb/execute'),
  MultiplyBonanza: () => import('./scripts/MultiplyBonanza/execute'),
  GoogolClover: () => import('./scripts/GoogolClover/execute'),
  HugEmAll: () => import('./scripts/HugEmAll/execute'),
  WinnerGroup: () => import('./scripts/WinnerGroup/execute'),
} satisfies Record<ScriptGameKey, () => Promise<{ default: ScriptClass }>>

 */
