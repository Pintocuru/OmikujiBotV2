// src/GameScripts/scripts/GoogolClover/params.ts
import { z } from 'zod'

/**
 * params
 */
export const suika = ['', 'ツルハシ', 'TNT', 'ツルハシTNT'] as const
export const GameParamsSchema = z.object({
  mode: z.enum(suika).default('').catch(''),
})
export type GameParams = z.infer<typeof GameParamsSchema>
