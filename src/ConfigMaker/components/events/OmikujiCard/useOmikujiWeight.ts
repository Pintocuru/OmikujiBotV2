// src/ConfigMaker/components/events/OmikujiCard/useOmikujiWeight.ts
import { OmikujiItemType } from '@/types/OmikujiData/'

/** インデックスに対応する色を返す（12色ループ） */
export const OMIKUJI_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#84cc16',
  '#ef4444',
  '#14b8a6',
  '#f97316',
  '#a855f7',
] as const

export function getColorForIndex(index: number): string {
  return OMIKUJI_COLORS[index % OMIKUJI_COLORS.length]
}

/** Weight更新：不変更新で新配列を返す */
export function updateItemWeight(items: OmikujiItemType[], index: number, weight: number): OmikujiItemType[] {
  return items.map((item, i) => (i === index ? { ...item, weight } : item))
}
