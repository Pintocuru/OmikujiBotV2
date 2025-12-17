// src\common\GameScripts\scriptsEngine\LogRank\GameScriptSchema.ts
import { z } from 'zod'

// 個別の記録（おみくじ1回分など）
export const GameRecordSchema = z.object({
  recordId: z.string(), // どの一回かを識別するID（UUID等）
  userId: z.string(), // 誰の記録か
  userName: z.string(), // 記録時の名前（変更対策）
  score: z.number(), // ランキング判定用のメイン数値
  itemValue1: z.string().optional(), // 汎用リスト
  itemValue2: z.string().optional(),
  itemValue3: z.string().optional(),

  createdAt: z.string(), // 記録日時
})

// ユーザーごとの累計統計
export const UserStatsSchema = z.object({
  userId: z.string(),
  name: z.string(),
  totalDraws: z.number().default(0), // 累計実行回数
  totalPoints: z.number().default(0), // 累計ポイント
  bestScore: z.number().default(0), // 自己ベスト
})

// ゲーム全体のステート
export const GameStateSchema = z.object({
  ruleId: z.string().default(''),
  userMap: z.record(z.string(), UserStatsSchema).default({}), // ユーザー情報
  logs: z.array(GameRecordSchema).default([]), // 履歴・ランキング
})

export type GameRecord = z.infer<typeof GameRecordSchema>
export type GameState = z.infer<typeof GameStateSchema>

/*
// UserStatsTypeのスキーマ
export const UserStatsTypeSchema = z.object({
  userId: z.string(), // ユーザーID
  name: z.string(), // 表示名
  draws: z.number().default(0), // このユーザーのおみくじ実行回数
  isOverLimit: z.boolean().optional(), // 回数を超えているか

  // 数値ベースの統計値（ロジック・ソート・分析向け）
  wins: z.number().default(0), // 勝利回数
  points: z.number().default(0), // 今回獲得ポイント
  totalPoints: z.number().default(0), // 総獲得ポイント
  rank: z.number().optional(), // 順位
  rate: z.number().optional(), // 勝率（例：0.75なら75%）
  // 文字列で表現するランキング用の表示項目（UI向け）
  itemValue1: z.string().optional(),
  itemValue2: z.string().optional(),
  itemValue3: z.string().optional(),
})

// ゲーム状態 - 拡張可能な設計でゲーム固有のデータを追加できる
export const GameStateSchema = z.object({
  ruleId: z.string().default('').catch(''), // 使用中のルールID
  totalDraws: z.number().default(0).catch(0), // 総おみくじ実行回数
  currentUserIds: z.array(z.string()).default([]).catch([]), // 参加ユーザーの履歴（時系列順）
  userStats: z.record(z.string(), UserStatsTypeSchema).default({}).catch({}), // ユーザー別統計情報
  userRecords: z.record(z.string(), z.array(UserStatsTypeSchema)).optional().catch(undefined), // ポイントモード用の複数記録
  userRankings: z.array(UserStatsTypeSchema).optional().catch(undefined), // ランキング
})

// ===== 型推論用のエクスポート =====
export type UserStatsType = z.infer<typeof UserStatsTypeSchema>
export type GameState = z.infer<typeof GameStateSchema>

*/
