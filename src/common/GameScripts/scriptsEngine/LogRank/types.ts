// src\common\GameScripts\scriptsEngine\LogRank\params.ts
import { z } from 'zod'
import { GameState, PostActionType, PostActionWordPartyType } from '@/types/'

/**
 * settings
 */
export const GameSettingsSchema = z.object({
  rankMode: z.enum(['wins', 'rate', 'point']).default('wins').catch('wins'),
  enableCount: z.number().int().min(0).max(100).default(5).catch(5),
})
export type GameSettings = z.infer<typeof GameSettingsSchema>

/**
 * params
 */
export const GameParamsSchema = z.object({
  isWin: z.boolean(), // 勝利したか
  getPoint: z.number(), // 獲得したポイント
  itemValue1: z.string().optional(), // 任意の項目1
  itemValue2: z.string().optional(), // 任意の項目2
  itemValue3: z.string().optional(), // 任意の項目3
})
export type GameParams = z.infer<typeof GameParamsSchema>

/**
 * postActions
 */
export const postActions: PostActionWordPartyType[] = []

/**
 * placeholders
 */
export const GamePlaceholderSchema = z.object({
  announceMessage: z.string().default(''),
  totalDraws: z.number().default(0),
  winsCount: z.number().default(0),
  winsRank: z.union([z.number(), z.literal('ランキング外')]).default('ランキング外'),
  winsRate: z.string().default('0.0'),
  totalPoints: z.number().default(0),
})
export type GamePlaceholder = z.infer<typeof GamePlaceholderSchema>

export interface GameContext {
  settings: GameSettings
  params: GameParams
  gameState: GameState
  currentUser: {
    userId: string
    name: string
  }
}

export interface GameResult {
  placeholder: GamePlaceholder
  postActions: PostActionType[]
}
