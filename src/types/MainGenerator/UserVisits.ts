// src/types/MainGenerator/UserVisits.ts
import { z } from 'zod'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { BaseVariantLabels } from '@shared/components/parts/ItemVariantTypes'

/**
 * ruleId別 訪問情報
 */
export const UserVisitRecordSchema = z.object({
  ...UserNameSchema.shape,
  eventKey: z.string(),
  visits: z.number(),
  visitValue: z.number(),
  lastVisit: z.number().default(() => Date.now()),
})
export type UserVisitRecord = z.infer<typeof UserVisitRecordSchema>

/**
 * 全体の訪問情報
 */
export const UserStatsRecordSchema = z.object({
  ...UserNameSchema.shape,
  tc: z.number().default(0), // コメント数(総合)
  no: z.number().default(0), // コメント数(配信内)
  isSyoken: z.boolean().default(false), // その配信で初見かどうか
  order: z.number().optional(), // 並び替え用（UI 側で自由に使える）
  team: z.enum(BaseVariantLabels).nullable().default(null),
  score: z.number().default(0),
  tags: z.array(z.string()).default([]), // タグ
  badges: z.array(z.string()).default([]), // バッジ
  giftPrice: z.number().default(0), // 個人ギフト金額
  lastVisit: z.number().default(() => Date.now()),
})
export type UserStatsRecord = z.infer<typeof UserStatsRecordSchema>
