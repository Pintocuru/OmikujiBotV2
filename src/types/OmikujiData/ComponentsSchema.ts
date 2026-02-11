// src/types/OmikujiData/ComponentsSchema.ts
import { z } from 'zod'
import { ComponentsCommonStyleSchema, ComponentsSettingsSchema } from './ComponentsSettingsSchema'

/**
 * スロット定義
 */
export const ComponentSlotSchema = z.enum(['primary', 'secondary', 'extra'])
export type ComponentSlot = z.infer<typeof ComponentSlotSchema>

/**
 * コンポーネント種類の定義
 */
export const componentKindConfig = {
  bubble: { slot: 'primary', label: 'フキダシ' },
  toast: { slot: 'secondary', label: 'トースト' },
  ranking: { slot: 'extra', label: 'ランキング' },
  counter: { slot: 'extra', label: 'カウンター' },
  WinnerGroup: { slot: 'extra', label: 'ラッキーメンバーズ' },
  flightSeat: { slot: 'extra', label: 'フライトシート' },
} as const satisfies Record<string, { slot: ComponentSlot; label: string }>

export type ComponentKind = keyof typeof componentKindConfig

export const ComponentKindSchema = z.enum(Object.keys(componentKindConfig) as [ComponentKind, ...ComponentKind[]])

/**
 * ComponentSlotで使用可能なComponentKindを取得する
 */
export function getKindsForSlot(slot: ComponentSlot): ComponentKind[] {
  return Object.entries(componentKindConfig)
    .filter(([_, config]) => config.slot === slot)
    .map(([kind, _]) => kind as ComponentKind)
}

/**
 * コンポーネント条件（スロットと種類の組み合わせ）
 * kindとslotの整合性をバリデーション
 */
export const ComponentsConditionSchema = z
  .object({
    slot: ComponentSlotSchema,
    kind: ComponentKindSchema,
  })
  .refine((data) => componentKindConfig[data.kind].slot === data.slot, {
    message: 'kindとslotの組み合わせが不正です',
  })
export type ComponentsCondition = z.infer<typeof ComponentsConditionSchema>

/**
 * コンポーネント条件配列（最大3つ、スロット重複不可）
 */
export const ComponentsConditionsSchema = z
  .array(ComponentsConditionSchema)
  .max(3)
  .refine((v) => new Set(v.map((c) => c.slot)).size === v.length, { message: 'slot は重複不可' })
export type ComponentsConditions = z.infer<typeof ComponentsConditionsSchema>

/**
 * ComponentsSchema
 */
export const ComponentsSchema = z.object({
  conditions: ComponentsConditionsSchema.default([
    { slot: 'primary', kind: 'bubble' },
    { slot: 'secondary', kind: 'toast' },
  ]).catch([
    { slot: 'primary', kind: 'bubble' },
    { slot: 'secondary', kind: 'toast' },
  ]),

  commonStyle: ComponentsCommonStyleSchema.default(ComponentsCommonStyleSchema.parse({})).catch(
    ComponentsCommonStyleSchema.parse({})
  ),

  settings: ComponentsSettingsSchema.default(ComponentsSettingsSchema.parse({})).catch(
    ComponentsSettingsSchema.parse({})
  ),
})

export type ComponentsType = z.infer<typeof ComponentsSchema>
