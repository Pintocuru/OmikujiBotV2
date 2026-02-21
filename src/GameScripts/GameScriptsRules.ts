// src/GameScripts/GameScriptsRules.ts
import { AccessLevelType } from '@shared/types'
import { ScriptGameKey } from '@/types'

// ゲームスクリプト
export const PRO_SCRIPTS = ['GouseiSuika', 'BomberSpin', 'DwarfBomb', 'MultiplyBonanza'] as const
export const GOD_SCRIPTS = ['GoogolClover', 'HugEmAll'] as const

export function getAvailableScripts(mode: AccessLevelType, fallback: ScriptGameKey[] = []): ScriptGameKey[] {
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
