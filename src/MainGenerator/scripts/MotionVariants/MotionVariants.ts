// src\MainGenerator\scripts\MotionVariants\useMotionVariants.ts
import type { MotionVariants } from '@vueuse/motion'
import { baseVariants } from './MotionVariantsBase'
import { slideVariants } from './MotionVariantsSlide'
import { flipVariants } from './MotionVariantsFlip'
import { scaleVariants } from './MotionVariantsScale'
import { elasticVariants } from './MotionVariantsElastic'

export const motionLabel = [
  'none', //
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
  ...baseVariants, // ベース・基本系
  ...slideVariants, // スライド系
  ...flipVariants, // フリップ・回転系
  ...scaleVariants, // スケール・ズーム系
  ...elasticVariants, // 弾性・特殊系
}
