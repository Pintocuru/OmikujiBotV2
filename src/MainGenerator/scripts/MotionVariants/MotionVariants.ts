// src/MainGenerator/scripts/MotionVariants/MotionVariants.ts
import type { MotionVariants } from '@vueuse/motion'
import { baseVariants } from './EnterLeave/MotionVariantsBase'
import { slideVariants } from './EnterLeave/MotionVariantsSlide'
import { flipVariants } from './EnterLeave/MotionVariantsFlip'
import { scaleVariants } from './EnterLeave/MotionVariantsScale'
import { elasticVariants } from './EnterLeave/MotionVariantsElastic'
import { loopBaseVariants } from './Loop/LoopMotionVariantsBase'
import { loopPulseVariants } from './Loop/LoopMotionVariantsPulse'
import { loopFloatVariants } from './Loop/LoopMotionVariantsFloat'
import { loopRotateVariants } from './Loop/LoopMotionVariantsRotate'
import { loopElasticVariants } from './Loop/LoopMotionVariantsElastic'
import { enterMotionMap, loopMotionMap } from '@/types/MetaMaps/enterMotionMaps'

export const enterMotionKeys = Object.keys(enterMotionMap) as EnterMotionType[]
export type EnterMotionType = keyof typeof enterMotionMap

// アニメーション設定を、VueUse Motionの variants 形式で定義
export const motionVariants: Record<EnterMotionType, MotionVariants<EnterMotionType>> = {
  ...baseVariants, // ベース・基本系
  ...slideVariants, // スライド系
  ...flipVariants, // フリップ・回転系
  ...scaleVariants, // スケール・ズーム系
  ...elasticVariants, // 弾性・特殊系
}

export type LoopMotionType = keyof typeof loopMotionMap

// ループアニメーション設定
export const loopMotionVariants: Record<LoopMotionType, MotionVariants<LoopMotionType>> = {
  ...loopBaseVariants,
  ...loopPulseVariants,
  ...loopFloatVariants,
  ...loopRotateVariants,
  ...loopElasticVariants,
}
