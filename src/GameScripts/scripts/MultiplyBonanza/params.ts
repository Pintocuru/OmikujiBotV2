// src/GameScripts/scripts/MultiplyBonanza/params.ts
import { z } from 'zod'

/**
 * params
 */
export const suika = ['', '風神', '雷神', '風雷神'] as const
export const GameParamsSchema = z.object({
  mode: z.enum(suika).default('').catch(''),
})
export type GameParams = z.infer<typeof GameParamsSchema>
