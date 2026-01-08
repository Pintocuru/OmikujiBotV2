// src/common/GameScripts/scriptsEngine/LogRank/types.ts
import { z } from 'zod'
import { GameStateType, PostActionType } from '@/types/'
import { GameRecordType, UserStatsType } from './GameScriptSchema'

/**
 * ランキングモードの定義
 */
export const RankingModeSchema = z.enum(['total_wins', 'win_rate', 'high_score'])
export type RankingMode = z.infer<typeof RankingModeSchema>

/**
 * 結果タイプの定義
 * より明示的に「何が起きたか」を表現
 */
export const ResultTypeSchema = z.enum(['win', 'lose', 'draw', 'score']).default('score')
export type ResultType = z.infer<typeof ResultTypeSchema>

/**
 * ゲーム実行時のパラメータ（改良版）
 */
export const GameParamsSchema = z.object({
  // ユーザー情報
  userId: z.string(),
  userName: z.string(),

  // BOT設定
  characterKey: z.string(),

  //  ゲームルール設定
  rankingMode: RankingModeSchema.default('total_wins'), // より明示的な名前
  maxDrawsPerUser: z.number().int().min(0).max(100).default(5), // より意味が明確

  // 今回の実行結果
  result: z.object({
    type: ResultTypeSchema, // 'win' | 'lose' | 'draw' | 'score'
    score: z.number(), // 獲得スコア（勝敗関係なく記録）
    itemValue1: z.string().optional(), // 表示用の汎用項目
    itemValue2: z.string().optional(),
    itemValue3: z.string().optional(),
  }),
})
export type GameParams = z.infer<typeof GameParamsSchema>

/**
 * ゲームコンテキスト
 */
export interface GameContext {
  params: GameParams
  gameState: GameStateType
}

/**
 * ランキング表示用の拡張型
 */
export interface RankingEntry extends GameRecordType {
  rank: number
  totalDraws?: number
  totalPoints?: number
}

/**
 * ゲーム実行結果
 */
export interface GameResult {
  currentRecord: GameRecordType
  currentUserStats: UserStatsType
  isOverLimit: boolean
  postActions: PostActionType[]
}

/**
 * ランキングモードのヘルパー関数
 */
export const isHighScoreMode = (params: GameParams): boolean => params.rankingMode === 'high_score'

export const isWinRateMode = (params: GameParams): boolean => params.rankingMode === 'win_rate'

export const isTotalWinsMode = (params: GameParams): boolean => params.rankingMode === 'total_wins'

/**
 * 結果タイプのヘルパー関数
 */
export const isWinResult = (params: GameParams): boolean => params.result.type === 'win'

export const isLoseResult = (params: GameParams): boolean => params.result.type === 'lose'

export const isDrawResult = (params: GameParams): boolean => params.result.type === 'draw'

export const isScoreResult = (params: GameParams): boolean => params.result.type === 'score'
