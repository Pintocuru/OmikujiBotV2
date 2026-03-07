// src/types/OmikujiData/CategoryType.ts
import { ActionSetSchema, ActionSetType } from './ActionSet'
import { PlaceholderSchema, PlaceholderType } from './PlaceholderSchema'
import { CharacterSchema, CharacterType } from './CharacterSchema'
import {
  CommentRuleSchema,
  CommentRuleType,
  MetaRuleSchema,
  MetaRuleType,
  rulesCategoryLabel,
  RulesCategoryType,
  RuleType,
  TimerRuleSchema,
  TimerRuleType,
} from './EventSchema'
import { categoryMap } from '../MetaMaps'

/**
 * RecordCategory
 */
export const recordCategoryLabel = [...rulesCategoryLabel, 'actionSets', 'placeholders', 'characters'] as const
export type RecordCategoryType = (typeof recordCategoryLabel)[number]
export type RecordCategoryUnion = RuleType | PlaceholderType | CharacterType
export type RecordCategoryDataMap = {
  comments: Record<string, CommentRuleType>
  timers: Record<string, TimerRuleType>
  metas: Record<string, MetaRuleType>
  actionSets: Record<string, ActionSetType>
  placeholders: Record<string, PlaceholderType>
  characters: Record<string, CharacterType>
}
export type RecordCategoryItemTypeMap = {
  comments: CommentRuleType
  timers: TimerRuleType
  metas: MetaRuleType
  actionSets: ActionSetType
  placeholders: PlaceholderType
  characters: CharacterType
}

// カテゴリ更新用のスキーママップ
export const RecordCategorySchemaMap = {
  comments: CommentRuleSchema,
  timers: TimerRuleSchema,
  metas: MetaRuleSchema,
  actionSets: ActionSetSchema,
  placeholders: PlaceholderSchema,
  characters: CharacterSchema,
} as const

export const isRulesCategory = (category: CategoryType): category is RulesCategoryType => {
  return rulesCategoryLabel.includes(category as RulesCategoryType)
}

/**
 * settingsCategory
 */
export const settingsCategoryLabel = ['jsonMerge', 'components', 'appInfo'] as const
export type SettingsCategoryType = (typeof settingsCategoryLabel)[number]

/**
 * CategoryType
 */
export const categoryTypeLabel = Object.keys(categoryMap) as CategoryType[]
export type CategoryType = keyof typeof categoryMap
