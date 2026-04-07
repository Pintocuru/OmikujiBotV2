// src/types/MetaMaps/enterMotionMaps.ts

export interface EnterMotionConfig {
  label: string
  initial: string // 登場前の隠し状態
  enter: string // 登場アニメーション（複数指定可）
  leave: string // 退場アニメーション
}

export const enterMotionMap = {
  none: {
    label: 'なし',
    initial: '',
    enter: '',
    leave: '',
  },
  // ─── スライド系 ──────────────────────────────
  slideUp: {
    label: '下から上へ',
    initial: 'opacity-0',
    enter: 'animate__fadeInUp',
    leave: 'animate__fadeOutUp',
  },
  slideDown: {
    label: '上から下へ',
    initial: 'opacity-0',
    enter: 'animate__fadeInDown',
    leave: 'animate__fadeOutDown',
  },
  slideLeft: {
    label: '右から左へ',
    initial: 'opacity-0',
    enter: 'animate__fadeInRight',
    leave: 'animate__fadeOutLeft',
  },
  slideRight: {
    label: '左から右へ',
    initial: 'opacity-0',
    enter: 'animate__fadeInLeft',
    leave: 'animate__fadeOutRight',
  },
  // ─── 回転・フリップ系 ────────────────────────
  flipInY: {
    label: 'Y軸フリップ',
    initial: 'opacity-0',
    enter: 'animate__flipInY',
    leave: 'animate__flipOutY',
  },
  flipX: {
    label: 'X軸フリップ',
    initial: 'opacity-0',
    enter: 'animate__flipInX',
    leave: 'animate__flipOutX',
  },
  rotateIn: {
    label: '回転しながら現れる',
    initial: 'opacity-0',
    enter: 'animate__rotateIn',
    leave: 'animate__rotateOut',
  },
  // ─── 拡大・スケール系 ────────────────────────
  zoomIn: {
    label: '拡大しながら現れる',
    initial: 'opacity-0',
    enter: 'animate__zoomIn',
    leave: 'animate__zoomOut',
  },
  scale: {
    label: 'スケール拡大',
    initial: 'opacity-0', // Animate.cssに単純なscaleはないためzoomInで代用
    enter: 'animate__zoomIn',
    leave: 'animate__zoomOut',
  },
  // ─── 弾性・変形系 ────────────────────────────
  bounce: {
    label: 'バウンスしながら現れる',
    initial: 'opacity-0',
    enter: 'animate__bounceIn',
    leave: 'animate__bounceOut',
  },
  rubberBand: {
    label: 'ゴム的変形',
    initial: 'opacity-0',
    // fadeIn と組み合わせることで「現れながら」を実現
    enter: 'animate__fadeIn animate__rubberBand',
    leave: 'animate__fadeOut',
  },
  jello: {
    label: 'ゼリー的変形',
    initial: 'opacity-0',
    enter: 'animate__fadeIn animate__jello',
    leave: 'animate__fadeOut',
  },
  // ─── フェード ──────────────────────────────
  fade: {
    label: 'フェード',
    initial: 'opacity-0',
    enter: 'animate__fadeIn',
    leave: 'animate__fadeOut',
  },
} as const satisfies Record<string, EnterMotionConfig>

// Animate.cssの全アニメーションタイプ（必要に応じて絞り込む）
export const loopMotion = [
  'none',
  // Attention Seekers
  'bounce',
  'flash',
  'pulse',
  'rubberBand',
  'shakeX',
  'shakeY',
  'headShake',
  'swing',
  'tada',
  'wobble',
  'jello',
  'heartbeat',
  // Back Entrances/Exits
  'backInDown',
  'backInLeft',
  'backInRight',
  'backInUp',
  'backOutDown',
  'backOutLeft',
  'backOutRight',
  'backOutUp',
  // Bouncing Entrances/Exits
  'bounceIn',
  'bounceInDown',
  'bounceInLeft',
  'bounceInRight',
  'bounceInUp',
  'bounceOut',
  'bounceOutDown',
  'bounceOutLeft',
  'bounceOutRight',
  'bounceOutUp',
  // Fading Entrances/Exits
  'fadeIn',
  'fadeInDown',
  'fadeInDownBig',
  'fadeInLeft',
  'fadeInLeftBig',
  'fadeInRight',
  'fadeInRightBig',
  'fadeInUp',
  'fadeInUpBig',
  'fadeOut',
  'fadeOutDown',
  'fadeOutDownBig',
  'fadeOutLeft',
  'fadeOutLeftBig',
  'fadeOutRight',
  'fadeOutRightBig',
  'fadeOutUp',
  'fadeOutUpBig',
  // Flippers
  'flip',
  'flipInX',
  'flipInY',
  'flipOutX',
  'flipOutY',
  // Lightspeed
  'lightSpeedInRight',
  'lightSpeedInLeft',
  'lightSpeedOutRight',
  'lightSpeedOutLeft',
  // Rotating Entrances/Exits
  'rotateIn',
  'rotateInDownLeft',
  'rotateInDownRight',
  'rotateInUpLeft',
  'rotateInUpRight',
  'rotateOut',
  'rotateOutDownLeft',
  'rotateOutDownRight',
  'rotateOutUpLeft',
  'rotateOutUpRight',
  // Sliding Entrances/Exits
  'slideInDown',
  'slideInLeft',
  'slideInRight',
  'slideInUp',
  'slideOutDown',
  'slideOutLeft',
  'slideOutRight',
  'slideOutUp',
  // Zooming Entrances/Exits
  'zoomIn',
  'zoomInDown',
  'zoomInLeft',
  'zoomInRight',
  'zoomInUp',
  'zoomOut',
  'zoomOutDown',
  'zoomOutLeft',
  'zoomOutRight',
  'zoomOutUp',
  // Specials
  'hinge',
  'jackInTheBox',
  'rollIn',
  'rollOut',
] as const
