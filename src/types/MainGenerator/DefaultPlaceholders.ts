// src/types/MainGenerator/DefaultPlaceholders.ts
import z from 'zod'
import { defaultPlaceholderMap } from '../MetaMaps'

// Zod スキーマ
export const DefaultPlaceholdersMetaSchema = z.object({
  viewer: z.coerce.number().default(0).catch(0),
  upVote: z.coerce.number().default(0).catch(0),
  follower: z.coerce.number().default(0).catch(0),
  lc: z.coerce.number().default(0).catch(0),
  commenter: z.coerce.number().default(0).catch(0),
  syoken: z.coerce.number().default(0).catch(0),
  winner: z.string().default('Test User').catch('Test User'),
  winnerId: z.string().default('Test User Id').catch('Test User Id'),
  clock: z.string().default('Test Clock').catch('Test Clock'),
})

export const DefaultPlaceholdersCommentSchema = z.object({
  user: z.string().default('Test User').catch('Test User'),
  userId: z.string().default('test').catch('test'),
  price: z.coerce.number().default(0).catch(0),
  tc: z.coerce.number().default(0).catch(0),
  draws: z.coerce.number().default(0).catch(0),
  ...DefaultPlaceholdersMetaSchema.shape,
})

// デフォルトで利用可能なプレースホルダーの定数配列
export const defaultPlaceholders = Object.keys(defaultPlaceholderMap) as DefaultPlaceholders[]
export type DefaultPlaceholders = keyof typeof defaultPlaceholderMap
