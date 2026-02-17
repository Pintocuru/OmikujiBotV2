// src\types\MainGenerator\UserVisits.ts
import { z } from 'zod'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * 全体の訪問情報
 */
export const UserVisitRecordSchema = z.object({
  ...UserNameSchema.shape,
  ruleId: z.string(),
  visitCount: z.number(),
})
export type UserVisitRecord = z.infer<typeof UserVisitRecordSchema>

/**
 * ruleId別 訪問情報
 */
export const UserStatsRecordSchema = z.object({
  ...UserNameSchema.shape,
  team: z.enum(['red', 'blue', 'green', 'yellow']).default('red'),
  score: z.number().default(0),
  wins: z.number().default(0),
  // 並べ替え用のキーなども追加可能
})
export type UserStatsRecord = z.infer<typeof UserStatsRecordSchema>
