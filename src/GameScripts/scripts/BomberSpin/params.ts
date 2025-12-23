// src/params.ts
import { z } from 'zod'

/**
 * params
 */
export const symbol = [
  '',
  'チェリー',
  'オレンジ',
  'ぶどう',
  'スイカ',
  'ベル',
  'ハット',
  'コイン',
  'ダイヤモンド',
] as const
export const GameParamsSchema = z.object({
  symbol: z.enum(symbol).default('').catch(''),
})
export type GameParams = z.infer<typeof GameParamsSchema>
