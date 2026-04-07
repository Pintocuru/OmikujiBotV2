import type { MotionVariants } from '@vueuse/motion'

type AnimationDef = string | MotionVariants<string>

/**
 * すべてのループアニメーションを静的なオブジェクトとして定義
 */
export const defaultLoopVariants = {
  // ─── なし ───────────────────────────────────────
  none: {
    initial: {},
    visible: {},
  },
  // ─── 移動系 ────────────────────────────────────
  float: {
    initial: { y: 0 },
    visible: {
      y: [-5, 5, -5],
      transition: { type: 'keyframes', ease: 'easeInOut', duration: 1500, repeat: Infinity },
    },
  },
  slideLR: {
    initial: { x: 0 },
    visible: {
      x: [-5, 5, -5],
      transition: { type: 'keyframes', ease: 'easeInOut', duration: 1500, repeat: Infinity },
    },
  },
  // ─── 回転系 ────────────────────────────────────
  rotate: {
    initial: { rotate: 0 },
    visible: {
      rotate: 360,
      transition: { type: 'keyframes', ease: 'linear', duration: 1500, repeat: Infinity },
    },
  },
  rotateR: {
    initial: { rotate: 0 },
    visible: {
      rotate: -360,
      transition: { type: 'keyframes', ease: 'linear', duration: 1500, repeat: Infinity },
    },
  },
  // ─── 弾性・変形系 ──────────────────────────────
  rubber: {
    initial: { scaleX: 1, scaleY: 1 },
    visible: {
      scaleX: [1, 1.35, 0.75, 1.2, 0.9, 1.05, 0.98, 1],
      scaleY: [1, 0.65, 1.3, 0.85, 1.1, 0.95, 1.02, 1],
      transition: { type: 'spring', stiffness: 300, damping: 12, repeat: Infinity },
    },
  },
  squash: {
    initial: { scaleY: 1, scaleX: 1 },
    visible: {
      scaleY: [1, 0.6, 1.1, 1],
      scaleX: [1, 1.2, 0.95, 1],
      transition: { type: 'keyframes', ease: 'easeOut', duration: 1500, repeat: Infinity },
    },
  },
  headShake: {
    initial: { rotateY: 0 },
    visible: {
      rotateY: [-30, 30, -30, 30],
      transition: { type: 'keyframes', ease: 'easeInOut', duration: 1500, repeat: Infinity },
    },
  },
  // ─── 傾き系 ────────────────────────────────────
  tilt: {
    initial: { rotate: 0, skewX: 0 },
    visible: {
      rotate: [0, -4, 5, -3, 3, 0],
      skewX: [0, -3, 4, -2, 2, 0],
      transition: { type: 'keyframes', ease: 'easeInOut', duration: 1500, repeat: Infinity },
    },
  },
  // ─── 点滅・明滅系 ──────────────────────────────
  glow: {
    initial: { opacity: 1 },
    visible: {
      // @ts-expect-error keyframes
      opacity: [1, 0.6, 1],
      transition: { type: 'keyframes', ease: 'easeInOut', duration: 1500, repeat: Infinity },
    },
  },
  blink: {
    initial: { opacity: 1 },
    visible: {
      // @ts-expect-error keyframes
      opacity: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      transition: { type: 'keyframes', ease: 'linear', duration: 1500, repeat: Infinity },
    },
  },
  // ─── 総合モーション ────────────────────────────
  combo: {
    initial: { scale: 1, rotate: 0, y: 0 },
    visible: {
      scale: [1, 1.08, 1],
      rotate: [0, 4, -4, 3, 0],
      y: [0, -10, 0],
      transition: { type: 'keyframes', ease: 'easeInOut', duration: 1500, repeat: Infinity },
    },
  },
  joyful: {
    initial: { scaleX: 1, scaleY: 1, y: 0, rotate: 0 },
    visible: {
      // 上がるときに細長く(scaleX小, scaleY大)、着地で少し潰れる
      scaleX: [1, 0.95, 1.05, 1],
      scaleY: [1, 1.05, 0.95, 1],
      // ぴょこぴょこと跳ねる
      y: [0, -15, 0, -5, 0],
      // わずかに左右に振る
      rotate: [0, 2, -2, 0],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1200, // 少し速め
        repeat: Infinity,
        repeatDelay: 300, // 跳ねたあとの余韻
      },
    },
  },
  gentle: {
    initial: { scale: 1, y: 0, skewX: 0 },
    visible: {
      // 深い呼吸のような拡大縮小
      scale: [1, 1.03, 1],
      // 浮遊感のあるゆっくりした上下
      y: [0, -6, 0],
      // 体がわずかにしなる（斜め変形）
      skewX: [0, 1.5, -1.5, 0],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 2500, // かなりゆったり
        repeat: Infinity,
      },
    },
  },
} as const satisfies Record<string, MotionVariants<string>>

export interface LoopMotionConfig {
  label: string
  variant: AnimationDef
  kind: 'none' | 'css' | 'motion'
}

export const loopMotionMap = {
  // ─── なし ───────────────────────────────────────
  none: {
    label: 'なし',
    variant: '',
    kind: 'none',
  },

  // ─── 移動系 ────────────────────────────────────
  bounce: {
    label: 'バウンド',
    variant: 'animate__bounce',
    kind: 'css',
  },
  shake: {
    label: '小刻みシェイク',
    variant: 'animate__shakeX',
    kind: 'css',
  },
  swing: {
    label: '左右揺れ',
    variant: 'animate__swing',
    kind: 'css',
  },
  wobble: {
    label: '大きく揺れ',
    variant: 'animate__wobble',
    kind: 'css',
  },

  // ─── 回転系 ────────────────────────────────────
  rotate: {
    label: '回転（時計回り）',
    variant: defaultLoopVariants.rotate,
    kind: 'motion',
  },
  rotateR: {
    label: '逆回転（反時計回り）',
    variant: defaultLoopVariants.rotateR,
    kind: 'motion',
  },

  // ─── 弾性・変形系 ──────────────────────────────
  rubberBand: {
    label: 'ゴムバンド',
    variant: 'animate__rubberBand',
    kind: 'css',
  },
  jello: {
    label: 'ゼリー',
    variant: 'animate__jello',
    kind: 'css',
  },

  // ─── 傾き系 ────────────────────────────────────
  tilt: {
    label: '傾き',
    variant: defaultLoopVariants.tilt,
    kind: 'motion',
  },

  // ─── 首振り系 ──────────────────────────────────
  headShake: {
    label: '首振り',
    variant: defaultLoopVariants.headShake,
    kind: 'motion',
  },

  // ─── 点滅・明滅系 ──────────────────────────────
  pulse: {
    label: '点滅',
    variant: 'animate__pulse',
    kind: 'css',
  },
  flash: {
    label: '高速明滅',
    variant: 'animate__flash',
    kind: 'css',
  },

  // ─── 総合モーション ────────────────────────────
  tada: {
    label: 'タダ！',
    variant: 'animate__tada',
    kind: 'css',
  },
  combo: {
    label: '総合揺れ',
    variant: defaultLoopVariants.combo,
    kind: 'motion',
  },
  joyful: { label: 'ぴょこぴょこ（元気）', variant: defaultLoopVariants.joyful, kind: 'motion' },
  gentle: { label: 'ゆったり（呼吸）', variant: defaultLoopVariants.gentle, kind: 'motion' },
} as const satisfies Record<string, LoopMotionConfig>
