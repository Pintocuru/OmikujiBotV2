// src/GameScripts/scripts/BomberSpin/params.ts
import { z } from 'zod'

/**
 * params
 * symbol=チェリー
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
  spin: z.number().min(3).max(8).nullable().default(null).catch(null),
})
export type GameParams = z.infer<typeof GameParamsSchema>
