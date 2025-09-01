// src/MainGenerator/components/OmikujiBot/composables/SizeConfig.ts

/**
 * レイアウト設定の基準値
 */
export const LAYOUT_BASE = {
  // 画面下部からの基本オフセット（各サイズの基準点）
  baseBottomOffset: 200,
  // サイズごとの追加オフセット
  sizeOffsets: {
    xs: 100, // baseBottomOffset + 100 = 300px
    sm: 180, // baseBottomOffset + 180 = 380px
    md: 240, // baseBottomOffset + 240 = 440px
    lg: 360, // baseBottomOffset + 360 = 560px
    xl: 440, // baseBottomOffset + 440 = 640px
  },
  // コメント間の余白
  commentSpacing: {
    xs: 20,
    sm: 20,
    md: 40,
    lg: 60,
    xl: 80,
  },
} as const

/**
 * アバターサイズの定義
 */
export const AVATAR_CONFIG = {
  xs: { class: 'w-24 h-24', size: 96 },
  sm: { class: 'w-32 h-32', size: 128 },
  md: { class: 'w-48 h-48', size: 192 },
  lg: { class: 'w-64 h-64', size: 256 },
  xl: { class: 'w-80 h-80', size: 320 },
} as const

/**
 * 計算ベースのサイズ設定（ViewBotCharacter対応版）
 */
export const SIZE_CONFIG = {
  xs: {
    text: 'text-sm',
    avatar: AVATAR_CONFIG.xs.class,
    spacing: LAYOUT_BASE.commentSpacing.xs,
    avatarBottom: `${LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.xs}px`,
    // ViewBotCharacter用の追加設定
    commentAreaBottom: `${AVATAR_CONFIG.xs.size + 60}px`, // アバターサイズ + 余白
    characterMargin: '-8px', // キャラクター間の重なり調整（小さいサイズ）
  },
  sm: {
    text: 'text-md',
    avatar: AVATAR_CONFIG.sm.class,
    spacing: LAYOUT_BASE.commentSpacing.sm,
    avatarBottom: `${LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.sm}px`,
    commentAreaBottom: `${AVATAR_CONFIG.sm.size + 80}px`,
    characterMargin: '-12px',
  },
  md: {
    text: 'text-lg',
    avatar: AVATAR_CONFIG.md.class,
    spacing: LAYOUT_BASE.commentSpacing.md,
    avatarBottom: `${LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.md}px`,
    commentAreaBottom: `${AVATAR_CONFIG.md.size + 100}px`,
    characterMargin: '-16px',
  },
  lg: {
    text: 'text-xl',
    avatar: AVATAR_CONFIG.lg.class,
    spacing: LAYOUT_BASE.commentSpacing.lg,
    avatarBottom: `${LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.lg}px`,
    commentAreaBottom: `${AVATAR_CONFIG.lg.size + 120}px`,
    characterMargin: '-20px',
  },
  xl: {
    text: 'text-2xl',
    avatar: AVATAR_CONFIG.xl.class,
    spacing: LAYOUT_BASE.commentSpacing.xl,
    avatarBottom: `${LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.xl}px`,
    commentAreaBottom: `${AVATAR_CONFIG.xl.size + 140}px`,
    characterMargin: '-24px',
  },
} as const

/**
 * displaySize型定義
 */
export const displaySize = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type DisplaySize = (typeof displaySize)[number]

export const displaySizeLabels: Record<DisplaySize, string> = {
  xs: 'XS (極小)',
  sm: 'SM (小)',
  md: 'MD (中)',
  lg: 'LG (大)',
  xl: 'XL (特大)',
}

/**
 * 設定変更時の影響を最小限に抑える関数
 */
export const updateLayoutBase = (newBaseOffset: number) => {
  // 基準値を変更すると全サイズに影響
  // 例：基準を200から250に変更すると、全サイズが50px上に移動
}

/**
 * デバッグ用：計算された値を確認
 */
export const getCalculatedValues = (size: DisplaySize) => {
  const config = SIZE_CONFIG[size]
  const avatarBottomDistance = LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets[size]
  return {
    avatarBottomDistance,
    avatarBottom: `${avatarBottomDistance}px`,
    spacing: config.spacing,
    text: config.text,
    avatar: config.avatar,
  }
}
