// tools/JsonMerge/KeySuffix.ts
import { OmikujiDataType, eventCategoryLabel, EventCategoryType } from '@/types/OmikujiData'

export function applyKeySuffix(data: OmikujiDataType, suffix?: string): OmikujiDataType {
  if (!suffix) return data

  const updated = {} as Pick<OmikujiDataType, EventCategoryType>

  for (const category of eventCategoryLabel) {
    // TypeScript の型システムはユニオンキーによる異構造インデックス代入を
    // 安全に扱えないため、ここでは any を使用。
    // 実行時の安全性は applySuffixToRules のジェネリック制約により保証される。
    updated[category] = applySuffixToRules(data[category] as any, suffix) as any
  }

  return {
    ...data,
    ...updated,
  }
}

function applySuffixToRules<T extends { key: string }>(rules: Record<string, T>, suffix: string): Record<string, T> {
  const normalized = suffix.length > 0 ? suffix[0].toUpperCase() + suffix.slice(1) : ''

  const result: Record<string, T> = {}

  for (const key in rules) {
    const item = rules[key]
    result[key + normalized] = {
      ...item,
      key: item.key + normalized,
    }
  }

  return result
}
