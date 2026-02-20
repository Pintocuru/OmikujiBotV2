// src/ConfigMaker/components/componentEditor/componentRules.ts
import { AccessLevelType } from '@shared/types'

// アイテム
export const BASIC_COMPONENTS = [] as const
export const PRO_COMPONENTS = ['bubble', 'toast', 'ranking', 'counter', 'flashBanner'] as const
export const GOD_COMPONENTS: string[] = []

// 判定ロジック
export function getAvailableComponents(mode: AccessLevelType, fallback: string[] = []) {
  switch (mode) {
    case 'godMode':
      return Array.from(new Set([...BASIC_COMPONENTS, ...PRO_COMPONENTS, ...GOD_COMPONENTS, ...fallback]))
    case 'pro':
      return Array.from(new Set([...BASIC_COMPONENTS, ...PRO_COMPONENTS, ...fallback]))
    case 'basic':
    case 'adv':
    default:
      return Array.from(new Set([...BASIC_COMPONENTS, ...fallback]))
  }
}
