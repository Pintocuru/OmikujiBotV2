// src\GameScripts\GameScriptsRules.ts
import { SettingMode } from '@/types/SettingMode'

// ゲームスクリプト
export const PRO_SCRIPTS = ['GouseiSuika', 'BomberSpin', 'DwarfBomb', 'MultiplyBonanza']
export const GOD_SCRIPTS = ['GoogolClover']

export function getAvailableScripts(mode: SettingMode, fallback: string[] = []) {
  switch (mode) {
    case 'godMode':
      return [...PRO_SCRIPTS, ...GOD_SCRIPTS, ...fallback]
    case 'pro':
      return [...PRO_SCRIPTS, ...fallback]
    case 'basic':
    case 'adv':
    default:
      return fallback
  }
}
