// src/GameScripts/scripts/WinnerGroup/params.ts
import { z } from 'zod'

/**
 * params
 */
export const GameParamsSchema = z.object({
  count: z.coerce.number().min(2).max(10).default(2).catch(2),
  label: z.string().default('今日のラッキーさん').catch('今日のラッキーさん'),
  useRule: z.boolean().default(false).catch(false),
})

export type GameParams = z.infer<typeof GameParamsSchema>
