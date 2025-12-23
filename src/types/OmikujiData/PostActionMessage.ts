// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\types\OmikujiData\PostActionMessage.ts
import z from 'zod'

/**
 * PostActionMessageSchema のメッセージ内容
 */

// user
export const UserMessageSchema = z.object({
  name: z.string().default('error'), // 名前
  profileImage: z.string().default(''), // プロフィール画像
  timestamp: z
    .number()
    .optional()
    .default(() => Date.now()), // タイムスタンプ
})

// Ranking
export const RankingMessageSchema = z.object({
  // 得点表示
  listName: z.string().optional(), // 名前
  symbol: z.string().optional(), // 名前の隣につけるやつ
  scoreText: z.string().default(''), // 表示用得点
  scoreValue: z.number().default(0), // 比較用
  // 設定
  scriptKey: z.string(), // コンポーネント判別用key
  isRank: z.boolean().default(true), // リストに載せるか
  isUniqueUser: z.boolean().default(false), // 1ユーザー1つか複数か
})

// PostAction MessageBody
export const PostActionMessageBodySchema = z
  .object({
    bubble: z.string().optional().catch(undefined),
    toast: z.string().optional().catch(undefined),
    user: UserMessageSchema.optional(),
    ranking: RankingMessageSchema.optional(),
  })
  .default({})
  .catch({})

export type PostActionMessageBodyType = z.infer<typeof PostActionMessageBodySchema>
