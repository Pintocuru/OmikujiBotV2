// src/types/OmikujiData/UiSettings/SettingsRankingSchema.ts
import { z } from 'zod'
import { ScriptGameExtendedKeySchema } from '../ActionSet'
import { themes } from '@shared/styles/DaisyUiTheme'

/**
 * ランキング GameRanking
 */
export const rankingSortOrderMap = {
  new: '新着順',
  high: 'スコア高い順',
  low: 'スコア低い順',
} as const

// ランキングコンポーネントの選択肢
export const rankingComponentMap = {
  rankStandard: 'カウンター+最後のユーザー',
} as const

/**
 * ランキング GameRanking
 */
const rankingSortOrder = Object.keys(rankingSortOrderMap) as RankingSortOrder[]
export type RankingSortOrder = keyof typeof rankingSortOrderMap

const rankingComponentsEnum = Object.keys(rankingComponentMap) as RankingComponent[]
export type RankingComponent = keyof typeof rankingComponentMap

export const GameRankingSchema = z.object({
  targetScriptKeys: z.array(ScriptGameExtendedKeySchema).default(['basicList']).catch(['basicList']),
  title: z.string().default('🍉スイカランキング🍉').catch('🍉スイカランキング🍉'),
  color: z.enum(themes).default('lofi').catch('lofi'),
  limit: z.number().min(1).max(20).default(5).catch(5),
  sortOrder: z.enum(rankingSortOrder).default('new').catch('new'),
  component: z.enum(rankingComponentsEnum).default('rankStandard').catch('rankStandard'),
})
export type GameRankingType = z.infer<typeof GameRankingSchema>
