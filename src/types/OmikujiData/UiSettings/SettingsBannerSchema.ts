// src/types/OmikujiData/UiSettings/SettingsBannerSchema.ts
import { z } from 'zod'

/**
 * ニュースフラッシュ コンポーネントの選択肢
 */
export const flashComponentMap = {
  standard: 'シンプル',
  ticker: 'ティッカー',
  glass: 'ガラス',
  arcade: 'アーケード',
} as const

/**
 * ニュースフラッシュ FlashBanner
 */
const flashComponentsEnum = Object.keys(flashComponentMap) as FlashComponent[]
export type FlashComponent = keyof typeof flashComponentMap

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

export const SettingsBannerSchema = z.object({
  component: z.enum(flashComponentsEnum).default('standard').catch('standard'),
  label: z.string().default('速報').catch(''),
  iconSize: z.number().int().min(0).max(24).default(12).catch(12), // アイコンの表示サイズ (px)
  displaySeconds: z.number().int().min(0).max(60).nullable().default(null).catch(null), // 表示時間
  showItemOnRight: z.boolean().default(false).catch(false), // キャラクターを右側に表示するか(falseで左側)
  defaultCharacterKey: z.string().nullable().default(null).catch(null), // デフォルトキャラクター
  defaultMessage: z.string().default(defaultMessage).catch(defaultMessage), // デフォルトメッセージ(通常プレースホルダーのみ使用可)
})
export type SettingsFlashBannerType = z.infer<typeof SettingsBannerSchema>
