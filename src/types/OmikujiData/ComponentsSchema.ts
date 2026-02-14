// src/types/OmikujiData/ComponentsSchema.ts
import { z } from 'zod'
import { ComponentsCommonStyleSchema, ComponentsSettingsSchema } from './ComponentsSettingsSchema'
import { COMPONENT_DEFINITIONS, ComponentKindSchema, ComponentSlotSchema } from '../ui/ComponentKind'

/**
 * コンポーネント条件（スロットと種類の組み合わせ）
 * kindとslotの整合性をバリデーション
 */
export const ComponentsConditionSchema = z
  .object({
    slot: ComponentSlotSchema,
    kind: ComponentKindSchema,
  })
  .refine((data) => COMPONENT_DEFINITIONS[data.kind].slot === data.slot, {
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
