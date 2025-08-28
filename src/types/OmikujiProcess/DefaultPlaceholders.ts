// src\types\OmikujiProcess\DefaultPlaceholders.ts
import z from 'zod'
import {
  countUnitCondition,
  countUnitConditionLabels,
  serviceMetaCondition,
  serviceMetaConditionLabels,
} from '@shared/types/'

// デフォルトで利用可能なプレースホルダーの定数配列
export const defaultPlaceholders = ['user', 'price', ...countUnitCondition, ...serviceMetaCondition] as const

// デフォルトプレースホルダーの型定義
export type DefaultPlaceholders = (typeof defaultPlaceholders)[number]

// Zod スキーマ
export const DefaultPlaceholdersMetaSchema = z.object({
  viewer: z.number().default(0).catch(0),
  upVote: z.number().default(0).catch(0),
})

export const DefaultPlaceholdersCommentSchema = z.object({
  user: z.string().default('テストユーザー').catch('テストユーザー'),
  price: z.number().default(0).catch(0),
  lc: z.number().default(0).catch(0),
  tc: z.number().default(0).catch(0),
  ...DefaultPlaceholdersMetaSchema.shape,
})

// デフォルトプレースホルダーの日本語ラベル定義
export const defaultPlaceholdersLabels: Record<DefaultPlaceholders, string> = {
  user: 'コメントしたユーザー',
  price: 'ギフト金額',
  ...countUnitConditionLabels,
  ...serviceMetaConditionLabels,
}
