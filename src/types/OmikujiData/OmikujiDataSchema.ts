// src/types/OmikujiDataSchema.ts
import { z } from 'zod'
import { DisplaySettingsSchema } from './DisplaySettingsSchema'
import { PlaceholderSchema } from './PlaceholderSchema'
import { CharacterSchema } from './CharacterSchema'
import { CommentRuleSchema, TimerRuleSchema } from './RulesSchema'
import { recordNormalization } from './OmikujiDataNormalize'
import { PackageJsonSchema } from '@shared/types'
import { WordPartySettingsSchema } from './WordPartySettings'
import { scriptSettingsSchema } from '../GameScript/GameScriptSettingsSchema'
import { PostActionRecordSchema } from './OmikujiSchema'
import { JsonMergeSchema } from './JsonMergeType'

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = z.object({
  ...PackageJsonSchema.shape,
  jsonMerge: JsonMergeSchema.catch([]),
  comments: recordNormalization(CommentRuleSchema),
  timers: recordNormalization(TimerRuleSchema),
  actionSets: recordNormalization(PostActionRecordSchema),
  placeholders: recordNormalization(PlaceholderSchema),
  characters: recordNormalization(CharacterSchema),
  scriptSettings: scriptSettingsSchema.catch({}),
  displaySettings: DisplaySettingsSchema.catch(DisplaySettingsSchema.parse({})),
  wordPartySettings: z.array(WordPartySettingsSchema).catch([]),
})

// 型定義
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>
