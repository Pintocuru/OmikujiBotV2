// src/MainGenerator/scripts/MotionVariants/Loop/LoopMotionVariantsFloat.ts

// 浮遊・揺れ系
export const loopFloatVariants = {
  floating: {
    initial: {
      y: 0,
    },
    visible: {
      y: [0, -15, 0],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 2500,
        repeat: Infinity,
      },
    },
  },
  swing: {
    initial: {
      rotate: 0,
    },
    visible: {
      rotate: [-5, 5, -5],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 2000,
        repeat: Infinity,
      },
    },
  },
}
