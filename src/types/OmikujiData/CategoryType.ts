// src/types/OmikujiData/CategoryType.ts
import { ActionSetSchema, ActionSetType } from './ActionSet'
import { PlaceholderSchema, PlaceholderType } from './PlaceholderSchema'
import { CharacterSchema, CharacterType } from './CharacterSchema'
import {
  CommentEventSchema,
  CommentEventType,
  ServiceEventSchema,
  ServiceEventType,
  rulesCategoryLabel,
  RulesCategoryType,
  EventType,
  TimerEventSchema,
  TimerEventType,
} from './EventSchema'
import { categoryMap } from '../MetaMaps'

/**
 * RecordCategory
 */
export const recordCategoryLabel = [...rulesCategoryLabel, 'actionSets', 'placeholders', 'characters'] as const
export type RecordCategoryType = (typeof recordCategoryLabel)[number]
export type RecordCategoryUnion = EventType | PlaceholderType | CharacterType
export type RecordCategoryDataMap = {
  comments: Record<string, CommentEventType>
  timers: Record<string, TimerEventType>
  metas: Record<string, ServiceEventType>
  actionSets: Record<string, ActionSetType>
  placeholders: Record<string, PlaceholderType>
  characters: Record<string, CharacterType>
}
export type RecordCategoryItemTypeMap = {
  comments: CommentEventType
  timers: TimerEventType
  metas: ServiceEventType
  actionSets: ActionSetType
  placeholders: PlaceholderType
  characters: CharacterType
}

// カテゴリ更新用のスキーママップ
export const RecordCategorySchemaMap = {
  comments: CommentEventSchema,
  timers: TimerEventSchema,
  metas: ServiceEventSchema,
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
