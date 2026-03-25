// src/types/OmikujiData/FlagsSchema.ts
import { z } from 'zod'
import { AccessLevelSchema } from '@shared/types'
import { normalizedObject } from './ParsedDefault'
import { UiKind } from './UiSchema'
import { gameMetaMap, uiKindMap } from '../MetaMaps'
import { ScriptGameKey, ScriptGameKeySchema } from './ActionSet'

/**
 * 通常表示設定
 */
export const FlagsUsageSchema = z.object({
  comments: AccessLevelSchema.default('basic').catch('basic'),
  timers: AccessLevelSchema.default('basic').catch('basic'),
  metas: AccessLevelSchema.default('basic').catch('basic'),
  reactions: AccessLevelSchema.default('none').catch('none'), // TODO:v3で標準に
  actionSets: AccessLevelSchema.default('basic').catch('basic'),
  placeholders: AccessLevelSchema.default('basic').catch('basic'),
  characters: AccessLevelSchema.default('basic').catch('basic'),
})
export type FlagsUsageType = z.infer<typeof FlagsUsageSchema>

/**
 * 管理者用表示設定 GOD MODE でのみ設定可能(通常は不可視)
 */
export const FlagsDeveloperSchema = z.object({
  licenseVisible: AccessLevelSchema.default('basic').catch('basic'),
  jsonMergeSettings: AccessLevelSchema.default('basic').catch('basic'),
  itemSlotEnabled: AccessLevelSchema.default('basic').catch('basic'),
})
export type FlagsDeveloperType = z.infer<typeof FlagsDeveloperSchema>

/**
 * FeatureUsageSchema
 */
export const FlagsSchema = z.object({
  usage: normalizedObject(FlagsUsageSchema),
  // TODO:components の廃止
  components: z
    .array(z.enum(Object.keys(uiKindMap) as [UiKind, ...UiKind[]]))
    .transform((list) => list.filter((x): x is UiKind => x in uiKindMap))
    .default(['bubble', 'toast', 'flashBanner']),
  gameScripts: z
    .array(ScriptGameKeySchema)
    .transform((list) => list.filter((x): x is ScriptGameKey => x in gameMetaMap))
    .default([]),
  developer: normalizedObject(FlagsDeveloperSchema),
})

export type FlagsType = z.infer<typeof FlagsSchema>
