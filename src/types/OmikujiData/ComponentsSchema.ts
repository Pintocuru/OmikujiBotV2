// src/types/OmikujiData/ComponentsSchema.ts
import { z } from 'zod'
import { ComponentsSettingsSchema } from './ComponentsSettingsSchema'
import { COMPONENT_MAP, ComponentKindSchema, ComponentSlotSchema } from '../ui/ComponentKind'
import { CharacterColorScheme } from './CharacterSchema'
import { normalizedObject } from './ParsedDefault'
import { fontFamilyMap } from '../MetaMaps'

/**
 * コンポーネント条件（スロットと種類の組み合わせ）
 * kindとslotの整合性をバリデーション
 */
export const ComponentsConditionSchema = z
  .object({
    slot: ComponentSlotSchema,
    kind: ComponentKindSchema,
  })
  .refine((data) => COMPONENT_MAP[data.kind].slot === data.slot, {
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
 * fontFamilyMap
 */
const fontFamilyOptions = Object.keys(fontFamilyMap) as FontFamilyType[]
export type FontFamilyType = keyof typeof fontFamilyMap
export const useFontFamily = (font: FontFamilyType) => fontFamilyMap[font].className ?? ''

/**
 * 共通スタイル設定
 */
export const ComponentsCommonStyleSchema = z.object({
  fontFamily: z.enum(fontFamilyOptions).default('default').catch('default'),
  defaultColor: CharacterColorScheme.default(CharacterColorScheme.parse({})).catch(CharacterColorScheme.parse({})),
})
export type ComponentsCommonStyle = z.infer<typeof ComponentsCommonStyleSchema>

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

  commonStyle: normalizedObject(ComponentsCommonStyleSchema),
  settings: normalizedObject(ComponentsSettingsSchema),
})

export type ComponentsType = z.infer<typeof ComponentsSchema>
