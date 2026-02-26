// src/MainGenerator/scripts/MotionVariants/Loop/LoopMotionVariantsElastic.ts

// 弾性・変形系
export const loopElasticVariants = {
  sway: {
    initial: {
      scaleX: 1,
      scaleY: 1,
    },
    visible: {
      scaleX: [1, 1.1, 0.95, 1.05, 1],
      scaleY: [1, 0.9, 1.05, 0.95, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1500,
        repeat: Infinity,
      },
    },
  },
  wiggle: {
    initial: {
      skewX: 0,
      skewY: 0,
    },
    visible: {
      skewX: [0, -5, 3, -2, 1, 0],
      skewY: [0, 1, -0.5, 0.3, -0.2, 0],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1000,
        repeat: Infinity,
        repeatDelay: 500,
      },
    },
  },
}
