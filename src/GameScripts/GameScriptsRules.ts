// src\GameScripts\GameScriptsRules.ts
import { SettingMode } from '@/common/FeatureAccess/SettingMode'

// ゲームスクリプト
export const PRO_SCRIPTS = ['GouseiSuika', 'BomberSpin', 'DwarfBomb', 'MultiplyBonanza']
export const GOD_SCRIPTS = ['GoogolClover', 'HugEmAll']

export function getAvailableScripts(mode: SettingMode, fallback: string[] = []) {
  switch (mode) {
    case 'godMode': {
      return Array.from(new Set([...PRO_SCRIPTS, ...GOD_SCRIPTS, ...fallback]))
    }

    case 'pro': {
      return Array.from(new Set([...PRO_SCRIPTS, ...fallback]))
    }

    case 'basic':
    case 'adv':
    default: {
      return Array.from(new Set(fallback))
    }
  }
}
