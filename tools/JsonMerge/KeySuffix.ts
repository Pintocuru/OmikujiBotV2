// tools\JsonMerge\KeySuffix.ts
import { OmikujiDataType } from '@/types/'

export function applyKeySuffix(data: OmikujiDataType, suffix?: string): OmikujiDataType {
  if (!suffix || suffix === '') return data

  return {
    ...data,
    comments: applySuffixToRules(data.comments, suffix),
    timers: applySuffixToRules(data.timers, suffix),
  }
}

function applySuffixToRules<T extends { key: string }>(
  rules: Record<string, T> | undefined,
  suffix: string
): Record<string, T> {
  if (!rules) return {}

  // 先頭大文字化
  const normalizedSuffix = suffix.length > 0 ? suffix[0].toUpperCase() + suffix.slice(1) : ''

  const result: Record<string, T> = {}
  for (const [key, item] of Object.entries(rules)) {
    result[`${key}${normalizedSuffix}`] = {
      ...item,
      key: `${item.key}${normalizedSuffix}`,
    }
  }
  return result
}
