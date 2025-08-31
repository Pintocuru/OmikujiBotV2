// src/MainGenerator/components/OmikujiBot/composables/SizeConfig.ts

/**
 * レイアウト設定の基準値
 */
export const LAYOUT_BASE = {
  // 画面下部からの基本オフセット（各サイズの基準点）
  baseBottomOffset: 200, // 基準となる下部からの距離
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
 * 計算ベースのサイズ設定
 * avatarTop の意図：画面下部から指定距離上に配置
 */
export const SIZE_CONFIG = {
  xs: {
    text: 'text-sm',
    avatar: AVATAR_CONFIG.xs.class,
    spacing: LAYOUT_BASE.commentSpacing.xs,
    // 画面下部からの距離（元の avatarTop と同じ概念）
    get avatarBottomDistance() {
      return LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.xs
    },
    // CSS用の値
    get avatarBottom() {
      return `${this.avatarBottomDistance}px`
    },
    // コメントエリアは画面上部からアバター位置まで
    get commentAreaBottom() {
      return `${this.avatarBottomDistance + 50}px` // アバターの少し上
    },
  },
  sm: {
    text: 'text-md',
    avatar: AVATAR_CONFIG.sm.class,
    spacing: LAYOUT_BASE.commentSpacing.sm,
    get avatarBottomDistance() {
      return LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.sm
    },
    get avatarBottom() {
      return `${this.avatarBottomDistance}px`
    },
    get commentAreaBottom() {
      return `${this.avatarBottomDistance + 50}px`
    },
  },
  md: {
    text: 'text-lg',
    avatar: AVATAR_CONFIG.md.class,
    spacing: LAYOUT_BASE.commentSpacing.md,
    get avatarBottomDistance() {
      return LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.md
    },
    get avatarBottom() {
      return `${this.avatarBottomDistance}px`
    },
    get commentAreaBottom() {
      return `${this.avatarBottomDistance + 50}px`
    },
  },
  lg: {
    text: 'text-xl',
    avatar: AVATAR_CONFIG.lg.class,
    spacing: LAYOUT_BASE.commentSpacing.lg,
    get avatarBottomDistance() {
      return LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.lg
    },
    get avatarBottom() {
      return `${this.avatarBottomDistance}px`
    },
    get commentAreaBottom() {
      return `${this.avatarBottomDistance + 50}px`
    },
  },
  xl: {
    text: 'text-2xl',
    avatar: AVATAR_CONFIG.xl.class,
    spacing: LAYOUT_BASE.commentSpacing.xl,
    get avatarBottomDistance() {
      return LAYOUT_BASE.baseBottomOffset + LAYOUT_BASE.sizeOffsets.xl
    },
    get avatarBottom() {
      return `${this.avatarBottomDistance}px`
    },
    get commentAreaBottom() {
      return `${this.avatarBottomDistance + 50}px`
    },
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
  return {
    avatarBottomDistance: config.avatarBottomDistance,
    avatarBottom: config.avatarBottom,
    commentAreaBottom: config.commentAreaBottom,
    spacing: config.spacing,
  }
}
