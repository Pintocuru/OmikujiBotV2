// src/common/GameScripts/scriptsEngine/LogRank/GameScriptSchema.ts
import { z } from 'zod'

/**
 * 個別の記録（1回ごとの実行結果）
 * ランキングや履歴の元データとして使用
 */
export const GameRecordSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  userId: z.string(), // 実行者のユーザーID
  userName: z.string(), // 記録時の名前（名前変更対策）
  score: z.number(), // ランキング判定用のメイン数値
  itemValue1: z.string().optional(), // 汎用表示項目1
  itemValue2: z.string().optional(), // 汎用表示項目2
  itemValue3: z.string().optional(), // 汎用表示項目3
  createdAt: z.string(), // 記録日時（ISO 8601形式）
})
export type GameRecordType = z.infer<typeof GameRecordSchema>

/**
 * ユーザーごとの累計統計
 */
export const UserStatsSchema = z.object({
  userId: z.string(),
  userName: z.string(), // 最新の表示名
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
  ruleId: z.string().default(''), // 使用中のルールID
  userMap: z.record(z.string(), UserStatsSchema).default({}), // ユーザー累計統計（Map）
  logs: z.array(GameRecordSchema).default([]), // 全実行履歴（配列）
})

// 型推論用のエクスポート
export type GameStateType = z.infer<typeof GameStateSchema>
