// src/types/OmikujiData/UiSettings/SettingsWinnerSchema.ts
import { z } from 'zod'
import { themes } from '@shared/styles/DaisyUiTheme'

/**
 * ラッキーメンバーズコンポーネントの表示名マップ
 */
export const winnerComponentMap = {
  valentineCoupling: 'バレンタイン・カップリング',
  topStars: 'トップスターズ',
} as const

/**
 * ラッキーメンバーズ WinnerGroup
 */
export type WinnerComponent = keyof typeof winnerComponentMap
const winnerComponentValues = Object.keys(winnerComponentMap) as WinnerComponent[]

export const SettingsWinnerSchema = z.object({
  component: z.enum(winnerComponentValues).default('valentineCoupling').catch('valentineCoupling'),
  targetEventKey: z.string().default('').catch(''), // どのruleを対象にするか
  label: z.string().default('ラッキーメンバーズ').catch('ラッキーメンバーズ'), // ラベル
  color: z.enum(themes).default('lofi').catch('lofi'), // DaisyUIテーマカラー
  queryString: z.string().default('count=2&label=今日のラッキーさん').catch('count=2&label=今日のラッキーさん'), // クリックで実行するクエリ文字列
})
export type SettingsWinnerGroupType = z.infer<typeof SettingsWinnerSchema>
