// src/types/OmikujiData/FeatureUsageSchema.ts
import { z } from 'zod'
import { AccessLevelSchema } from '@shared/types'
import { normalizedObject } from './ParsedDefault'
import { UiKind } from './ComponentsSchema'
import { gameMetaMap, uiKindMap } from '../MetaMaps'
import { ScriptGameKey, ScriptGameKeySchema } from './ActionSet'

/**
 * 通常表示設定
 */
export const FeatureUsageUsageSchema = z.object({
  comments: AccessLevelSchema.default('basic').catch('basic'),
  timers: AccessLevelSchema.default('basic').catch('basic'),
  metas: AccessLevelSchema.default('basic').catch('basic'),
  actionSets: AccessLevelSchema.default('basic').catch('basic'),
  placeholders: AccessLevelSchema.default('basic').catch('basic'),
  characters: AccessLevelSchema.default('basic').catch('basic'),
})
export type FeatureUsageUsageType = z.infer<typeof FeatureUsageUsageSchema>

/**
 * 管理者用表示設定 GOD MODE でのみ設定可能(通常は不可視)
 */
export const FeatureUsageDeveloperSchema = z.object({
  licenseVisible: AccessLevelSchema.default('basic').catch('basic'),
  jsonMergeSettings: AccessLevelSchema.default('basic').catch('basic'),
})
export type FeatureUsageDeveloperType = z.infer<typeof FeatureUsageDeveloperSchema>

/**
 * FeatureUsageSchema
 */
export const FeatureUsageSchema = z.object({
  usage: normalizedObject(FeatureUsageUsageSchema),
  components: z
    .array(z.enum(Object.keys(uiKindMap) as [UiKind, ...UiKind[]]))
    .transform((list) => list.filter((x): x is UiKind => x in uiKindMap))
    .default(['bubble', 'toast']),
  gameScripts: z
    .array(ScriptGameKeySchema)
    .transform((list) => list.filter((x): x is ScriptGameKey => x in gameMetaMap))
    .default([]),
  developer: normalizedObject(FeatureUsageDeveloperSchema),
})

export type FeatureUsageType = z.infer<typeof FeatureUsageSchema>
