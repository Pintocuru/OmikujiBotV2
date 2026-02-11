// src/types/OmikujiDataSchema.ts
import { z } from 'zod'
import { PlaceholderSchema } from './PlaceholderSchema'
import { CharacterSchema } from './CharacterSchema'
import { CommentRuleSchema, MetaRuleSchema, TimerRuleSchema } from './RulesSchema'
import { PackageJsonSchema } from '@shared/types'
import { JsonMergeSchema } from './JsonMergeType'
import { ComponentsSchema } from './ComponentsSchema'
import { FeatureUsageSchema } from './FeatureUsageSchema'
import { SettingsSchema } from './SettingsSchema'
import { ActionSetSchema } from './ActionSet'

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
  components: ComponentsSchema.catch(ComponentsSchema.parse({})),
  featureUsage: FeatureUsageSchema.catch(FeatureUsageSchema.parse({})),
  settings: SettingsSchema.catch(SettingsSchema.parse({})),
})
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>

function normalizedRecord<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.record(z.string(), itemSchema).default({}).catch({})
}
