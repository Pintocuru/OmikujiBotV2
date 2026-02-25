// src/types/OmikujiData/OmikujiDataSchema.ts
import { z } from 'zod'
import { PlaceholderSchema } from './PlaceholderSchema'
import { CharacterSchema } from './CharacterSchema'
import { CommentRuleSchema, MetaRuleSchema, TimerRuleSchema } from './RulesSchema'
import { PackageJsonSchema } from '@shared/types'
import { JsonMergeSchema } from './JsonMergeType'
import { ComponentsSchema } from './UiSchema'
import { FlagsSchema } from './FeatureUsageSchema'
import { SettingsSchema } from './SettingsSchema'
import { ActionSetSchema } from './ActionSet'
import { normalizedRecord, normalizedObject } from './ParsedDefault'

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = z.object({
  ...PackageJsonSchema.shape,
  jsonMerge: JsonMergeSchema.catch([]),
  comments: normalizedRecord(CommentRuleSchema),
  timers: normalizedRecord(TimerRuleSchema),
  metas: normalizedRecord(MetaRuleSchema),
  actionSets: normalizedRecord(ActionSetSchema),
  placeholders: normalizedRecord(PlaceholderSchema),
  characters: normalizedRecord(CharacterSchema),
  components: normalizedObject(ComponentsSchema),
  featureUsage: normalizedObject(FlagsSchema),
  settings: normalizedObject(SettingsSchema),
})
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>

/**
// v3から
export const OmikujiDataSchema = z.object({
  ...PackageJsonSchema.shape,

  // rules -> events
  events: z.object({
    comments: normalizedRecord(CommentRuleSchema),
    timers: normalizedRecord(TimerRuleSchema),
    // metas -> services
    services: normalizedRecord(MetaRuleSchema),
  }),

  assets: z.object({
    // actionSets -> actions
    actions: normalizedRecord(ActionSetSchema),
    placeholders: normalizedRecord(PlaceholderSchema),
    characters: normalizedRecord(CharacterSchema),
  }),

  // components -> ui
  ui: ComponentsSchema.catch(ComponentsSchema.parse({})),
  // featureUsage -> flags
  flags: FeatureUsageSchema.catch(FeatureUsageSchema.parse({})),
  jsonMerge: JsonMergeSchema.catch([]),
  settings: SettingsSchema.catch(SettingsSchema.parse({})),
})
 */
