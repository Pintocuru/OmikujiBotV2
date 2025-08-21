// src\MainGenerator\scripts\MotionVariants\useMotionVariants.ts
import type { MotionVariants } from '@vueuse/motion'

export const motionLabel = [
  'test', // test
  'slideUp', // 現在の下から上へ
  'slideDown', // 上から下へ
  'slideLeft', // 右から左へ
  'slideRight', // 左から右へ
  'flipInY', // Y軸フリップ
  'flipX', // X軸フリップ
  'zoomIn', // 拡大しながら現れる
  'pulse', //
  'scale', // スケール拡大
  'rotateIn', // 回転しながら現れる
  'bounce', // バウンスしながら現れる
  'rubberBand', //
  'jello', //
  'fade', // フェード
] as const
export type MotionType = (typeof motionLabel)[number]

// アニメーション設定を、VueUse Motionの variants 形式で定義
export const motionVariants: Record<MotionType, MotionVariants<MotionType>> = {
  test: {
    initial: {
      scale: 1,
    },
    enter: {
      scale: [1, 1.3, 1, 1.3, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1200,
        delay: 0,
        repeat: Infinity,
      },
    },
  },
  slideUp: {
    initial: {
      y: 50,
      opacity: 0,
    },
    enter: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'keyframes',
        ease: 'easeOut',
        duration: 800,
        delay: 200,
      },
    },
  },
  slideDown: {
    initial: {
      y: '-100%',
      opacity: 0,
    },
    enter: {
      y: '0%',
      opacity: 1,
      transition: {
        type: 'keyframes',
        ease: 'easeOut',
        duration: 800,
        delay: 150,
      },
    },
  },
  slideLeft: {
    initial: { opacity: 0, x: 300 },
    enter: { opacity: 1, x: 0, transition: { duration: 600, ease: 'easeOutBack' } },
    leave: { opacity: 0, x: -300, transition: { duration: 400, ease: 'easeInBack' } },
  },
  slideRight: {
    initial: { opacity: 0, x: -300 },
    enter: { opacity: 1, x: 0, transition: { duration: 600, ease: 'easeOutBack' } },
    leave: { opacity: 0, x: 300, transition: { duration: 400, ease: 'easeInBack' } },
  },
  flipInY: {
    initial: {
      rotateY: -90,
      opacity: 0,
    },
    enter: {
      rotateY: 0,
      opacity: 1,
      transition: {
        type: 'keyframes',
        ease: 'easeOut',
        duration: 700,
        delay: 100,
      },
    },
  },
  flipX: {
    initial: { opacity: 0, rotateX: 90, z: 100 },
    enter: { opacity: 1, rotateX: 0, z: 0, transition: { duration: 900, ease: 'easeOutElastic' } },
    leave: {
      opacity: 0,
      rotateX: -90,
      z: -100,
      transition: { duration: 400, ease: 'easeInQuart' },
    },
  },
  zoomIn: {
    initial: {
      scale: 0,
      opacity: 0,
    },
    enter: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: 600,
        delay: 100,
      },
    },
  },
  pulse: {
    initial: {
      scale: 1,
    },
    enter: {
      scale: [1, 1.1, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1000,
        delay: 0,
        repeat: Infinity,
      },
    },
  },
  scale: {
    initial: { opacity: 0, scale: 0.3, y: 30 },
    enter: { opacity: 1, scale: 1, y: 0, transition: { duration: 500, ease: 'easeOutBack' } },
    leave: { opacity: 0, scale: 0.3, y: -30, transition: { duration: 300, ease: 'easeInBack' } },
  },
  rotateIn: {
    initial: {
      rotate: -200,
      scale: 0,
      opacity: 0,
    },
    enter: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: 1000,
        delay: 0,
      },
    },
  },
  bounce: {
    initial: {
      y: -100,
      scale: 0.3,
      opacity: 1,
    },
    enter: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 8,
        duration: 1200,
        delay: 0,
      },
    },
  },
  rubberBand: {
    initial: {
      scaleX: 1,
      scaleY: 1,
    },
    enter: {
      scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
      scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1000,
        delay: 0,
      },
    },
  },
  jello: {
    initial: {
      skewX: 0,
      skewY: 0,
    },
    enter: {
      skewX: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0],
      skewY: [0, 2.5, -1.25, 0.625, -0.3125, 0.15625, 0],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 900,
        delay: 100,
      },
    },
  },
  fade: {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 600, ease: 'easeOutQuart' } },
    leave: { opacity: 0, transition: { duration: 400, ease: 'easeInQuart' } },
  },
}
