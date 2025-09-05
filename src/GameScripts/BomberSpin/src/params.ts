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
  { actionType: 'wordParty', delaySeconds: 0, wordParty: '!bombBack' },
  { actionType: 'wordParty', delaySeconds: 0, wordParty: '<<symbol>>' },
  { actionType: 'wordParty', delaySeconds: 1.8, wordParty: '!bombFire' },
]

/**
 * placeholders
 */
export const GamePlaceholderSchema = z.object({
  ...LogGamePlaceholderSchema.shape, // LogRank のプレースホルダーを継承
  message: z.string().min(1, { message: 'message は必須です' }),
  symbol: z.string().min(1, { message: 'symbol は必須です' }),
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
    value: 'userのセブンスピン!1/4/8000!合計$8004枚獲得!',
  },
  {
    key: 'symbol',
    name: 'シンボル',
    description: '当選した図柄を返します',
    value: 'セブン',
  },
  {
    key: 'payout',
    name: '獲得したポイント',
    description: '獲得したポイントを返します',
    value: '8004',
  },
  // LogRank のプレースホルダーを継承
  ...selectedLogPlaceholders,
]
