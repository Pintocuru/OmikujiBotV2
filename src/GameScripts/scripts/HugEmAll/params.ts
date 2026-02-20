// src/GameScripts/scripts/HugEmAll/params.ts
import { z } from 'zod'

/**
 * ゲームモード
 * - '': 通常モード
 * - 'lucky': ラッキーモード（初期体力+1、クリティカル確率UP）
 * - 'berserker': バーサーカーモード（ダメージ2倍、体力消費2倍）
 * - 'shield': シールドモード（体力消費なし、ダメージ半減）
 */
export const gameModes = ['', 'lucky', 'berserker', 'shield'] as const
export const GameParamsSchema = z.object({
  mode: z.enum(gameModes).default('').catch(''),
})
export type GameParams = z.infer<typeof GameParamsSchema>
