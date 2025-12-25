// src/types/OmikujiDataSchema.ts
import { z } from 'zod'
import { DisplaySettingsSchema } from './DisplaySettingsSchema'
import { PlaceholderSchema } from './PlaceholderSchema'
import { CharacterSchema } from './CharacterSchema'
import { CommentRuleSchema, TimerRuleSchema } from './RulesSchema'
import { recordNormalization } from './OmikujiDataNormalize'
import { PackageJsonSchema } from '@shared/types'
import { WordPartySettingsSchema } from './WordPartySettings'
import { ActionSetSchema } from './OmikujiSchema'
import { JsonMergeSchema } from './JsonMergeType'

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
  displaySettings: DisplaySettingsSchema.catch(DisplaySettingsSchema.parse({})),
  components: z.any(),
  featureUsage: z.any(),
  settings: z.any(),
})

// 型定義
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>
