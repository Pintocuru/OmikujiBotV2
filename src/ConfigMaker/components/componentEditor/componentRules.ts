// src\ConfigMaker\components\componentEditor\componentRules.ts
import { SettingMode } from '@/types/SettingMode'

// コンポーネント
export const BASIC_COMPONENTS = ['bubble', 'toast'] as const
export const PRO_COMPONENTS = ['ranking', 'counter'] as const
export const GOD_COMPONENTS: string[] = []

// 判定ロジック
export function getAvailableComponents(mode: SettingMode, fallback: string[] = []) {
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
