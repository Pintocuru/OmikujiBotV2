// src/MainGenerator/scripts/MotionVariants/CharacterLoopMotion.ts
import { LoopMotionType } from '@/types'
import type { MotionVariants } from '@vueuse/motion'

type LoopVariantOptions = {
  duration: number // 秒単位
  loop: boolean
}

const ms = (sec: number) => sec * 1000
const repeat = (loop: boolean) => (loop ? Infinity : 0)

export const createLoopVariants = (opts: LoopVariantOptions): Record<LoopMotionType, MotionVariants<string>> => {
  const d = ms(opts.duration)
  const r = repeat(opts.loop)

  return {
    // ─── なし ───────────────────────────────────────
    none: {
      initial: {},
      visible: {},
    },

    // ─── 拡大縮小系 ────────────────────────────────
    pulse: {
      initial: { scale: 1 },
      visible: {
        scale: [1, 1.12, 1],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },
    heartbeat: {
      initial: { scale: 1 },
      visible: {
        scale: [1, 1.15, 1, 1.15, 1, 1],
        transition: {
          type: 'keyframes',
          ease: 'easeInOut',
          duration: d,
          repeat: r,
          repeatDelay: d * 0.4,
        },
      },
    },

    // ─── 移動系 ────────────────────────────────────
    float: {
      initial: { y: 0 },
      visible: {
        y: [-5, 5, -5],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },
    slideLR: {
      initial: { x: 0 },
      visible: {
        x: [-5, 5, -5],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },

    // ─── 回転系 ────────────────────────────────────
    rotate: {
      initial: { rotate: 0 },
      visible: {
        rotate: 360,
        transition: { type: 'keyframes', ease: 'linear', duration: d, repeat: r },
      },
    },
    rotateR: {
      initial: { rotate: 0 },
      visible: {
        rotate: -360,
        transition: { type: 'keyframes', ease: 'linear', duration: d, repeat: r },
      },
    },

    // ─── 揺れ系（Aviutl定番） ──────────────────────
    swing: {
      initial: { rotate: 0 },
      visible: {
        rotate: [-8, 8, -8],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },
    shake: {
      initial: { x: 0 },
      visible: {
        x: [0, -6, 4, -3, 2, -1, 0, 0, 0, 0, 0],
        transition: { type: 'keyframes', ease: 'linear', duration: d, repeat: r },
      },
    },
    bounce: {
      initial: { y: 0 },
      visible: {
        y: [0, -28, 0, -14, 0, 0, 0],
        transition: {
          type: 'keyframes',
          ease: [0.34, 1.56, 0.64, 1],
          duration: d,
          repeat: r,
        },
      },
    },

    // ─── 弾性・変形系（Aviutl人気） ────────────────
    rubber: {
      initial: { scaleX: 1, scaleY: 1 },
      visible: {
        scaleX: [1, 1.35, 0.75, 1.2, 0.9, 1.05, 0.98, 1],
        scaleY: [1, 0.65, 1.3, 0.85, 1.1, 0.95, 1.02, 1],
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 12,
        },
      },
    },
    squash: {
      initial: { scaleY: 1, scaleX: 1 },
      visible: {
        scaleY: [1, 0.6, 1.1, 1],
        scaleX: [1, 1.2, 0.95, 1],
        transition: {
          type: 'keyframes',
          ease: 'easeOut',
          duration: d * 0.6,
          repeat: r,
        },
      },
    },

    // ─── 点滅・明滅系 ──────────────────────────────
    glow: {
      initial: { opacity: 1 },
      visible: {
        // @ts-expect-error 型定義がkeyframes配列に未対応
        opacity: [1, 0.6, 1],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },
    blink: {
      initial: { opacity: 1 },
      visible: {
        // @ts-expect-error 型定義がkeyframes配列に未対応
        opacity: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        transition: {
          type: 'keyframes',
          ease: 'linear',
          duration: d * 0.4,
          repeat: r,
        },
      },
    },

    // ─── 傾き系（Aviutl定番） ──────────────────────
    tilt: {
      initial: { rotate: 0, skewX: 0 },
      visible: {
        rotate: [0, -4, 5, -3, 3, 0],
        skewX: [0, -3, 4, -2, 2, 0],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },

    // ─── 総合モーション（Aviutlで人気） ────────────
    combo: {
      initial: { scale: 1, rotate: 0, y: 0 },
      visible: {
        scale: [1, 1.08, 1],
        rotate: [0, 4, -4, 3, 0],
        y: [0, -10, 0],
        transition: {
          type: 'keyframes',
          ease: 'easeInOut',
          duration: d,
          repeat: r,
        },
      },
    },
  }
}

// デフォルトオプションでの静的エクスポート（後方互換・型参照用）
export const defaultLoopVariants = createLoopVariants({ duration: 1.5, loop: true })
