// src/common/GameScripts/scriptsEngine/LogRank/types.ts
import { z } from 'zod'
import { GameState, PostActionType, UserStatsType } from '@/types/'

/**
 * ゲーム実行時のパラメータ（設定を統合）
 */
export const GameParamsSchema = z.object({
  // ユーザーデータ
  userId: z.string(),
  name: z.string(),

  // BOT用パラメータ
  characterKey: z.string(),

  // ゲーム設定
  rankMode: z.enum(['wins', 'rate', 'point']).default('wins'),
  enableCount: z.number().int().min(0).max(100).default(5),

  // 実行時パラメータ
  isWin: z.boolean(),
  getPoint: z.number(),
  itemValue1: z.string().optional(),
  itemValue2: z.string().optional(),
  itemValue3: z.string().optional(),
})
export type GameParams = z.infer<typeof GameParamsSchema>

/**
 * ゲームコンテキスト
 */
export interface GameContext {
  params: GameParams
  gameState: GameState
}

/**
 * ゲーム実行結果
 */
export interface GameResult {
  currentUserStats: UserStatsType
  postActions: PostActionType[]
}

/**
 * ランキングモードの判定
 */
export const isPointMode = (params: GameParams): boolean => params.rankMode === 'point'
export const isWinnerMode = (params: GameParams): boolean => params.rankMode !== 'point'
