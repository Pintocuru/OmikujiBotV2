// src/types/GameScript/GameStateSchema.ts
import { idSchema } from '@shared/types'
import { z } from 'zod'

/**
 * 個別の記録（1回ごとの実行結果）
 */
export const GameLogSchema = z.object({
  id: idSchema,
  userId: z.string(), // 実行者のユーザーID
  score: z.number(), // ランキング判定用のメイン数値
  item: z.string().optional(), // 汎用string
  flag: z.boolean().optional(), // 汎用boolean
  createdAt: z.number().default(() => Date.now()), // 記録日時（ISO 8601形式）
})
export type GameLogType = z.infer<typeof GameLogSchema>

/**
 * ユーザーごとの累計統計
 */
export const UserStatsSchema = z.object({
  userId: z.string(),
  totalDraws: z.number().default(0), // 累計実行回数（上限チェック用）
  totalPoints: z.number().default(0), // 累計ポイント
  totalWins: z.number().default(0), // 累計勝利回数
  bestScore: z.number().default(0), // 自己ベストスコア
})
export type UserStatsType = z.infer<typeof UserStatsSchema>

/**
 * ゲーム全体のステート
 */
export const GameStateSchema = z.object({
  // TODO(v3): ruleId > eventKey
  ruleId: z.string().default(''), // 使用中のイベントID
  userMap: z.record(z.string(), UserStatsSchema).default({}), // ユーザー累計統計（Map）
  logs: z.array(GameLogSchema).default([]), // 全実行履歴（配列）
})
export type GameStateType = z.infer<typeof GameStateSchema>
