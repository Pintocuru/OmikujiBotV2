// src/params.ts
import { z } from 'zod'

/**
 * params
 */
export const suika = ['スイカゲーム', 'カボチャゲーム', 'クジラゲーム'] as const
export const GameParamsSchema = z.object({
  mode: z.enum(suika).default('スイカゲーム').catch('スイカゲーム'),
})
export type GameParams = z.infer<typeof GameParamsSchema>
