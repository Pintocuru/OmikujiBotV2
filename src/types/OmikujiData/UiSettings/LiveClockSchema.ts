// src/types/OmikujiData/UiSettings/SettingsClockSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'

/**
 * ライブクロック LiveClock
 */
export const clockComponentMap = {
  morning: 'モーニング',
  soundPlayer: 'サウンドプレイヤー',
  clearGlass: 'クリアガラス',
  steampunk: 'スチーム',
  disco: 'ディスコ',
} as const

const clockComponentsEnum = Object.keys(clockComponentMap) as ClockComponent[]
export type ClockComponent = keyof typeof clockComponentMap

const defaultMessage = `<<
  'チャンネル登録・高評価、お願いします！',
  '現在の視聴数 【<<viewer>>】 / 高評価 【<<upVote>>】',
  'コメントはお気軽にどうぞ！',
  '【<<commenter>>名】がコメントしてくれてます！',
  '【<<winner>>さん】もコメントありがとう！',
  '応援してくれると励みになります！',
  '高評価が配信の支えになります！',
  'コメントがあると、配信が賑やかになります！気軽にどうぞ！',
  '登録者数【<<follower>>】人 ご視聴ありがとうございます'
>>`

export const LiveClockSchema = z.object({
  component: z.enum(clockComponentsEnum).default('morning').catch('morning'),
  color: normalizedObject(DaisyUiThemeFieldsSchema), // DaisyUIテーマカラー
  isSecond: z.boolean().default(false).catch(false), //
  defaultMessage: z.string().default(defaultMessage).catch(defaultMessage),
})
export type LiveClockType = z.infer<typeof LiveClockSchema>
