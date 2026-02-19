// src\types\MainGenerator\UserVisits.ts
import { z } from 'zod'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { BaseVariantLabels } from '@shared/components/parts/ItemVariantTypes'

/**
 * ruleId別 訪問情報
 */
export const UserVisitRecordSchema = z.object({
  ...UserNameSchema.shape,
  ruleId: z.string(),
  visitCount: z.number(),
})
export type UserVisitRecord = z.infer<typeof UserVisitRecordSchema>

/**
 * 全体の訪問情報
 */
export const UserStatsRecordSchema = z.object({
  ...UserNameSchema.shape,
  order: z.number().optional(), // 並び替え用（UI 側で自由に使える）
  team: z.enum(BaseVariantLabels).default('error'),
  score: z.number().default(0),
  tags: z.array(z.string()).default([]), // タグ
  badges: z.array(z.string()).default([]), // バッジ
  lastVisit: z.number().default(() => Date.now()),
})
export type UserStatsRecord = z.infer<typeof UserStatsRecordSchema>
