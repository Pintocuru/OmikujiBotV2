// src\types\OmikujiData\PostActionMessage.ts
import z from 'zod'

/**
 * PostActionMessageSchema のメッセージ内容
 */

// Ranking
export const RankingMessageSchema = z.object({
  // 得点表示
  listName: z.string().optional(), // 名前
  symbol: z.string().optional(), // 名前の隣につけるやつ
  scoreText: z.string().default(''), // 表示用得点
  scoreValue: z.number().optional(), // 比較用
  variant: z.string().optional(), // 得点表示のカラー(型は BaseVariant)
  // 設定
  scriptKey: z.string().default(''), // アイテム判別用key
  isRank: z.boolean().default(true), // リストに載せるか
  isUniqueUser: z.boolean().default(false), // 1ユーザー1つか複数か
})
