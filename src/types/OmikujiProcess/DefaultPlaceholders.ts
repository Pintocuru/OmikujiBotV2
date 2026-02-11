// src\types\OmikujiProcess\DefaultPlaceholders.ts
import z from 'zod'
import { serviceMetaCondition, serviceMetaConditionLabels, serviceMetaConditionMap } from '@shared/types/'
import { countUnitCondition, countUnitConditionMap } from '@shared/types/trigger'

// デフォルトで利用可能なプレースホルダーの定数配列
export const defaultPlaceholders = [
  'user', // ユーザー名
  'userId', // ユーザーID
  'price', // 金額
  'commenter', //  配信枠のコメントをしたユーザー数
  'winner', //  配信枠のコメントをしたランダムなユーザー
  ...countUnitCondition, // lc:配信枠のコメント数 tc:個人の総コメント数
  ...serviceMetaCondition, // viewer:配信枠の視聴者数 upVote:配信枠の高評価数
] as const

// デフォルトプレースホルダーの型定義
export type DefaultPlaceholders = (typeof defaultPlaceholders)[number]

// Zod スキーマ
export const DefaultPlaceholdersMetaSchema = z.object({
  viewer: z.coerce.number().default(0),
  upVote: z.coerce.number().default(0),
  commenter: z.coerce.number().default(0),
  winner: z.string().default('テストユーザー'),
})

export const DefaultPlaceholdersCommentSchema = z.object({
  user: z.string().default('テストユーザー'),
  userId: z.string().default('test'),
  price: z.coerce.number().default(0), //
  lc: z.coerce.number().default(0),
  tc: z.coerce.number().default(0),
  draws: z.coerce.number().default(0),
  ...DefaultPlaceholdersMetaSchema.shape,
})

// デフォルトプレースホルダーの日本語ラベル定義
export const defaultPlaceholdersLabels: Record<DefaultPlaceholders, string> = {
  user: 'コメントしたユーザー',
  userId: 'コメントしたユーザーID',
  price: 'ギフト金額',
  commenter: 'コメントをしたユーザー数',
  winner: 'コメントをしたランダムなユーザー',
  lc: countUnitConditionMap.lc.label,
  tc: countUnitConditionMap.tc.label,
  draws: countUnitConditionMap.draws.label,
  viewer: serviceMetaConditionMap.viewer.label,
  upVote: serviceMetaConditionMap.upVote.label,
}

// 省略形（短い）ラベル
export const defaultPlaceholdersShortLabels: Record<DefaultPlaceholders, string> = {
  user: '[ユーザー名]',
  userId: '[ユーザーID]',
  price: '[ギフト金額]',
  lc: '[配信コメント数]',
  tc: '[個人コメント数]',
  draws: '[おみくじ発動回数]',
  commenter: '[コメントしたユーザー数]',
  winner: '[ランダムユーザー]',
  viewer: '[視聴者数]',
  upVote: '[高評価数]',
}
