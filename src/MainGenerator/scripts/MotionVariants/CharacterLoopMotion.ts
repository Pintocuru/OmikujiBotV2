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

    // ─── ベース系 ────────────────────────────────────
    glow: {
      initial: { opacity: 1 },
      visible: {
        // @ts-expect-error 型定義がkeyframes配列に未対応
        opacity: [1, 0.4, 1],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },

    // ─── パルス・拡大縮小系 ──────────────────────────
    pulse: {
      initial: { scale: 1 },
      visible: {
        scale: [1, 1.12, 1],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },
    breathing: {
      initial: { scale: 1 },
      visible: {
        scale: [1, 1.05, 1],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },
    heartbeat: {
      initial: { scale: 1 },
      visible: {
        scale: [1, 1.15, 1, 1.15, 1],
        transition: {
          type: 'keyframes',
          ease: 'easeInOut',
          duration: d,
          repeat: r,
          repeatDelay: d * 0.4, // durationに比例した間隔
        },
      },
    },

    // ─── 浮遊・揺れ系 ────────────────────────────────
    floating: {
      initial: { y: 0 },
      visible: {
        y: [0, -15, 0],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },
    swing: {
      initial: { rotate: 0 },
      visible: {
        rotate: [-5, 5, -5],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },

    // ─── 弾性・変形系 ────────────────────────────────
    sway: {
      initial: { scaleX: 1, scaleY: 1 },
      visible: {
        scaleX: [1, 1.1, 0.95, 1.05, 1],
        scaleY: [1, 0.9, 1.05, 0.95, 1],
        transition: { type: 'keyframes', ease: 'easeInOut', duration: d, repeat: r },
      },
    },
    wiggle: {
      initial: { skewX: 0, skewY: 0 },
      visible: {
        skewX: [0, -5, 3, -2, 1, 0],
        skewY: [0, 1, -0.5, 0.3, -0.2, 0],
        transition: {
          type: 'keyframes',
          ease: 'easeInOut',
          duration: d,
          repeat: r,
          repeatDelay: d * 0.5,
        },
      },
    },

    // ─── 回転系 ──────────────────────────────────────
    rotate: {
      initial: { rotate: 0 },
      visible: {
        rotate: 360,
        transition: { type: 'keyframes', ease: 'linear', duration: d, repeat: r },
      },
    },
    flipLoop: {
      initial: { rotateY: 0 },
      visible: {
        rotateY: [0, 180, 360],
        transition: {
          type: 'keyframes',
          ease: 'easeInOut',
          duration: d,
          repeat: r,
          repeatDelay: d * 0.5,
        },
      },
    },
  }
}

// デフォルトオプションでの静的エクスポート（後方互換・型参照用）
export const defaultLoopVariants = createLoopVariants({ duration: 1.5, loop: true })
