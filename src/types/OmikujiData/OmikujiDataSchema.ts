// src/types/OmikujiDataSchema.ts
import { z } from 'zod'
import { DisplaySettingsSchema } from './DisplaySettingsSchema'
import { PlaceholderSchema } from './PlaceholderSchema'
import { CharacterSchema } from './CharacterSchema'
import { CommentRuleSchema, TimerRuleSchema } from './RulesSchema'
import { recordNormalization } from './OmikujiDataNormalize'
import { PackageJsonSchema } from '@shared/types'
import { ActionSetSchema } from './OmikujiSchema'
import { JsonMergeSchema } from './JsonMergeType'
import { ComponentsSchema } from './ComponentsSchema'
import { FeatureUsageSchema } from './FeatureUsageSchema'
import { SettingsSchema } from './SettingsSchema'

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = z.object({
  ...PackageJsonSchema.shape,
  jsonMerge: JsonMergeSchema.catch([]),
  comments: recordNormalization(CommentRuleSchema),
  timers: recordNormalization(TimerRuleSchema),
  actionSets: recordNormalization(ActionSetSchema),
  placeholders: recordNormalization(PlaceholderSchema),
  characters: recordNormalization(CharacterSchema),
  //  displaySettings: DisplaySettingsSchema.catch(DisplaySettingsSchema.parse({})),
  components: ComponentsSchema.catch(ComponentsSchema.parse({})),
  featureUsage: FeatureUsageSchema.catch(FeatureUsageSchema.parse({})),
  settings: SettingsSchema.catch(SettingsSchema.parse({})),
})

// 型定義
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>
