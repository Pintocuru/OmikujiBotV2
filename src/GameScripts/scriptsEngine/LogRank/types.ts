// src/GameScripts/scriptsEngine/LogRank/types.ts
import { z } from 'zod'
import { UserNameSchema } from '@shared/types'

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
  user: UserNameSchema, // ユーザー情報
  characterKey: z.string().nullable().default(null), // BOT設定

  //  ゲームルール設定
  rankingMode: RankingModeSchema.default('total_wins'), // ランキングモード
  maxDraws: z.number().int().min(0).max(100).default(5), // 最大回数

  // 今回の実行結果
  result: z.object({
    type: ResultTypeSchema, // 'win' | 'lose' | 'draw' | 'score'
    score: z.number(), // 獲得スコア（勝敗関係なく記録）
    item: z.string().optional(), // 表示用の汎用項目
    flag: z.boolean().optional(), // 表示用の汎用項目
  }),
})
export type GameParams = z.infer<typeof GameParamsSchema>
