// src/types/OmikujiData/OmikujiDataSchema.ts
import { z } from 'zod'
import { PlaceholderSchema } from './PlaceholderSchema'
import { CharacterSchema } from './CharacterSchema'
import { CommentEventSchema, ReactionEventSchema, ServiceEventSchema, TimerEventSchema } from './EventSchema'
import { PackageJsonSchema } from '@shared/types'
import { JsonMergeSchema } from './JsonMergeType'
import { UiSchema } from './UiSchema'
import { FlagsSchema } from './FlagsSchema'
import { SettingsSchema } from './SettingsSchema'
import { ActionSetSchema } from './ActionSet'
import { normalizedRecord, normalizedObject } from './ParsedDefault'

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = z.object({
  ...PackageJsonSchema.shape,
  jsonMerge: JsonMergeSchema.catch([]),
  comments: normalizedRecord(CommentEventSchema),
  timers: normalizedRecord(TimerEventSchema),
  metas: normalizedRecord(ServiceEventSchema),
  reactions: normalizedRecord(ReactionEventSchema),
  actionSets: normalizedRecord(ActionSetSchema),
  placeholders: normalizedRecord(PlaceholderSchema),
  characters: normalizedRecord(CharacterSchema),
  components: normalizedObject(UiSchema),
  featureUsage: normalizedObject(FlagsSchema),
  settings: normalizedObject(SettingsSchema),
})
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>

/**
// v3から
// events はRecord -> Arrayに変更する
// (assetsはRecordのまま)
// これにより、orderの管理を廃止。
export const OmikujiDataSchema = z.object({
  ...PackageJsonSchema.shape,

  // rules -> events
  events: z.object({
    comments: normalizedRecord(CommentRuleSchema),
    timers: normalizedRecord(TimerRuleSchema),
    // metas -> services
    services: normalizedRecord(MetaRuleSchema),
    reactions: normalizedRecord(ReactionEventSchema),
    queues: normalizedRecord(QueueEventSchema),
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
