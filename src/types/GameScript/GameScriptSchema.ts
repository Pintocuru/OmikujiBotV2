// shared/types/GameScriptSchema.ts
// 250728_1
import { z } from 'zod';

// ===== ゲーム状態管理 =====

// UserStatsTypeのスキーマ
export const UserStatsTypeSchema = z.object({
 userId: z.string(), // ユーザーID
 name: z.string(), // 表示名
 draws: z.number().default(0), // このユーザーのおみくじ実行回数
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
 priority: z.number().optional() // 表示の優先度
});

// ゲーム状態 - 拡張可能な設計でゲーム固有のデータを追加できる
export const GameStateSchema = z.object({
 ruleId: z.string().default('').catch(''), // 使用中のルールID
 totalDraws: z.number().default(0).catch(0), // 総おみくじ実行回数
 currentUserIds: z.array(z.string()).default([]).catch([]), // 参加ユーザーの履歴（時系列順）
 userStats: z.record(z.string(), UserStatsTypeSchema).default({}).catch({}), // ユーザー別統計情報
 userRecords: z.record(z.string(), z.array(UserStatsTypeSchema)).optional().catch(undefined), // ポイントモード用の複数記録
 userRankings: z.array(UserStatsTypeSchema).optional().catch(undefined) // ランキング
});

// ===== 型推論用のエクスポート =====
export type UserStatsType = z.infer<typeof UserStatsTypeSchema>;
export type GameState = z.infer<typeof GameStateSchema>;
