// src/MainGenerator/ui/CookieCounter/composables/useCookieLabelResolver.ts
import { LIVER_TEXT_LABELS } from '@main/ui/StreamCounter/composables/DefaultLabels'
import type { StreamDefaultKey } from '@/types'

/**
 * CookieCounter 専用ラベル解決
 * - default → LIVER_TEXT_LABELS（テキスト固定）
 * - event   → eventLabels から解決
 * - variable → variableLabels から解決
 */
export function useCookieLabelResolver(eventLabels: Record<string, string>, variableLabels: Record<string, string>) {
  const getLabel = (type: 'default' | 'event' | 'variable', target: string, label?: string): string => {
    switch (type) {
      case 'default':
        return (label || LIVER_TEXT_LABELS[target as StreamDefaultKey]) ?? target
      case 'event':
        return (label || eventLabels[target]) ?? target
      case 'variable':
        return (label || variableLabels[target]) ?? target
    }
  }

  return { getLabel }
}
