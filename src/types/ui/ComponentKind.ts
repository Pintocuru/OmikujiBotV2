//src\types\ui\ComponentKind.ts
import z from 'zod'

/**
 * スロット定義
 */
export const ComponentSlotSchema = z.enum(['primary', 'secondary', 'extra'])
export type ComponentSlot = z.infer<typeof ComponentSlotSchema>

/**
 * コンポーネント種類の定義
 */
export const COMPONENT_MAP = {
  bubble: { slot: 'primary', label: 'フキダシ' },
  toast: { slot: 'secondary', label: 'トースト' },
  ranking: { slot: 'extra', label: 'ランキング' },
  counter: { slot: 'extra', label: 'カウンター' },
  winnerGroup: { slot: 'extra', label: 'ラッキーメンバーズ' },
  flightSeat: { slot: 'extra', label: 'フライトシート' },
} as const

export type ComponentKind = keyof typeof COMPONENT_MAP
const COMPONENT_KINDS = Object.keys(COMPONENT_MAP) as ComponentKind[]
export const ComponentKindSchema = z.enum(COMPONENT_KINDS as [ComponentKind, ...ComponentKind[]])

/**
 * ComponentSlotで使用可能なComponentKindを取得する
 */
export function getKindsForSlot(slot: ComponentSlot): ComponentKind[] {
  return Object.entries(COMPONENT_MAP)
    .filter(([_, config]) => config.slot === slot)
    .map(([kind]) => kind as ComponentKind)
}
