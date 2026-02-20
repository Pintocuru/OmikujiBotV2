// src/GameScripts/scripts/GouseiSuika/params.ts
import { z } from 'zod'

/**
 * params
 */
export const suika = ['スイカ', 'カボチャ', 'クジラ'] as const
export const life = 3
export const GameParamsSchema = z.object({
  mode: z.enum(suika).default('スイカ').catch('スイカ'),
  life: z.coerce.number().min(1).max(99).default(life).catch(life),
})
export type GameParams = z.infer<typeof GameParamsSchema>
