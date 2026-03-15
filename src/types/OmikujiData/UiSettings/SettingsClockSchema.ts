// src/types/OmikujiData/UiSettings/SettingsClockSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../ParsedDefault'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'

/**
 * ニュースフラッシュ FlashBanner
 */
export const clockComponentMap = {
  standard: 'シンプル',
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

export const SettingsClockSchema = z.object({
  component: z.enum(clockComponentsEnum).default('standard').catch('standard'),
  color: normalizedObject(DaisyUiThemeFieldsSchema), // DaisyUIテーマカラー

  defaultMessage: z.string().default(defaultMessage).catch(defaultMessage),
})
export type SettingsClockType = z.infer<typeof SettingsClockSchema>
