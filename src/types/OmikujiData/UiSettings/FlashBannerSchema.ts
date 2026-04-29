// src/types/OmikujiData/UiSettings/FlashBannerSchema.ts
import { z } from 'zod'

/**
 * ニュースフラッシュ FlashBanner
 */
export const flashComponentMap = {
  standard: {
    label: 'シンプル',
    accessLevel: 'basic',
    isScrollSelect: true,
  },
  scroll: {
    label: 'スクロール',
    accessLevel: 'basic',
    isScrollSelect: false,
  },
  ticker: {
    label: 'ティッカー',
    accessLevel: 'pro',
    isScrollSelect: false,
  },
  glass: {
    label: 'ガラス',
    accessLevel: 'pro',
    isScrollSelect: true,
  },
  clear: {
    label: 'クリア',
    accessLevel: 'pro',
    isScrollSelect: true,
  },
  arcade: {
    label: 'アーケード',
    accessLevel: 'pro',
    isScrollSelect: true,
  },
  tweet: {
    label: 'ツイート',
    accessLevel: 'basic',
    isScrollSelect: false,
  },
} as const

// scrollReturnMode の表示ラベル
export const scrollReturnModeMap = {
  loop: { title: 'ループ', description: '端で即座に先頭へ戻る' },
  fade: { title: 'フェード', description: 'フェードアウトして先頭へ戻る' },
} as const

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

export const FlashBannerSchema = z.object({
  component: z.enum(flashComponentsEnum).default('standard').catch('standard'),
  label: z.string().default('速報').catch(''),
  iconSize: z.number().int().min(0).max(60).default(12).catch(12),
  displaySeconds: z.number().int().min(0).max(60).nullable().default(null).catch(null),
  showItemOnRight: z.boolean().default(false).catch(false),
  defaultCharacterKey: z.string().nullable().default(null).catch(null),
  defaultMessage: z.string().default(defaultMessage).catch(defaultMessage),
  scrollSpeed: z.number().min(0).max(100).default(50).catch(50), // テキストスクロール速度 (px/sec)
  scrollReturnMode: z.enum(['loop', 'fade']).default('loop').catch('loop'), // 長文スクロール終了後の戻り方
})
export type FlashBannerType = z.infer<typeof FlashBannerSchema>
