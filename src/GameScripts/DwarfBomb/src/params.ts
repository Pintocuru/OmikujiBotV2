// src/params.ts
import { z } from 'zod'
import {
  GamePlaceholderSchema as LogGamePlaceholderSchema,
  placeholders as LogPlaceholders,
  GamePlaceholder as LogGamePlaceholder,
} from '@/GameScripts/LogRank/src/params'
import { ScriptPlaceholderItem, ParameterItem, PostActionWordPartyType } from '@/types/'

/**
 * settings
 */
export const GameSettingsSchema = z.object({
  isParty: z.boolean().default(true).catch(true),
  rankingLimit: z.number().int().min(1).max(30).default(10).catch(10),
  enableCount: z.number().int().min(0).max(100).default(5).catch(5),
})
export type GameSettings = z.infer<typeof GameSettingsSchema>

export const settings: ParameterItem<GameSettings>[] = [
  {
    key: 'isParty', // キー名
    name: 'WordPartyで音を鳴らすか', // ルール名
    description: 'ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない', // 説明文
    inputType: 'boolean', // 'select' | 'number' | 'string' | 'boolean'
    defaultValue: true, // デフォルト値
  },
  {
    key: 'rankingLimit', // キー名
    name: '上位何位まで表示させるか', // ルール名
    description: '大きくしすぎるとはみ出ます。', // 説明文
    inputType: 'number', // 'select' | 'number' | 'string' | 'boolean'
    defaultValue: 10, // デフォルト値
    min: 1,
    max: 30,
  },
  {
    key: 'enableCount', // キー名
    name: 'ランキング上限回数', // ルール名
    description: 'この回数を超える場合、結果はランキングに入りません', // 説明文
    inputType: 'number', // 'select' | 'number' | 'string' | 'boolean'
    defaultValue: 5, // デフォルト値
    min: 0,
    max: 100,
  },
]

/**
 * params
 */
export const GameParamsSchema = z.object({})
export type GameParams = z.infer<typeof GameParamsSchema>
export const params: ParameterItem<GameParams>[] = []

/**
 * postActions
 */
export const postActions: PostActionWordPartyType[] = [
  { actionType: 'wordParty', delaySeconds: 0, wordParty: '!dwarfBombRabbit' },
  { actionType: 'wordParty', delaySeconds: 3, wordParty: '!bombFire' },
  { actionType: 'wordParty', delaySeconds: 3, wordParty: '<<rabbits & items>>' },
]

/**
 * placeholders
 */
export const GamePlaceholderSchema = z.object({
  ...LogGamePlaceholderSchema.shape, // LogRank のプレースホルダーを継承
  message: z.string().min(1, { message: 'message は必須です' }),
  day: z.number().min(1, { message: 'day は必須です' }),
  payout: z.number().min(1, { message: 'payout は必須です' }),
})
export type GamePlaceholder = z.infer<typeof GamePlaceholderSchema>

// LogPlaceholders から必要なプロパティを抜粋
const wantedLogPlaceholderIds = ['announceMessage', 'totalDraws', 'winsRank', 'totalPoints']
const selectedLogPlaceholders: ScriptPlaceholderItem<LogGamePlaceholder>[] = LogPlaceholders.filter((item) =>
  wantedLogPlaceholderIds.includes(item.key)
)

export const placeholders: ScriptPlaceholderItem<GamePlaceholder>[] = [
  {
    key: 'message',
    name: '標準メッセージ',
    description: 'デフォルトの返答',
    value: 'userは🐰14匹とダイナマイト🧨と鉱山へ。1枚!5000枚!1枚!💎EPIC WIN💎5002枚獲得!',
  },
  {
    key: 'day',
    name: 'うさぎの数',
    description: '鉱山を掘ったうさぎの数を返します',
    value: '14',
  },
  {
    key: 'payout',
    name: '獲得したポイント',
    description: '獲得したポイントを返します',
    value: '5002',
  },
  // LogRank のプレースホルダーを継承
  ...selectedLogPlaceholders,
]
