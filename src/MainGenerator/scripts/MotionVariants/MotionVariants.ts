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

export const motionLabel = [
  'none', //
  'slideUp', // 現在の下から上へ
  'slideDown', // 上から下へ
  'slideLeft', // 右から左へ
  'slideRight', // 左から右へ
  'flipInY', // Y軸フリップ
  'flipX', // X軸フリップ
  'zoomIn', // 拡大しながら現れる
  'scale', // スケール拡大
  'rotateIn', // 回転しながら現れる
  'bounce', // バウンスしながら現れる
  'rubberBand', // 表示時のゴム的変形
  'jello', // 表示時のゼリー的変形
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

export const loopMotionLabel = [
  'none',
  'pulse', // 拡大縮小の繰り返し
  'breathing', // ゆっくりとした拡大縮小
  'heartbeat', // 心臓の鼓動のような動き
  'floating', // 上下に浮遊
  'swing', // 左右に揺れる
  'sway', // ゆらゆら揺れる(rubberBand風)
  'wiggle', // 小刻みに揺れる(jello風)
  'rotate', // 回転し続ける
  'flipLoop', // Y軸フリップの繰り返し
  'glow', // 明滅
] as const
export type LoopMotionType = (typeof loopMotionLabel)[number]

// ループアニメーション設定
export const loopMotionVariants: Record<LoopMotionType, MotionVariants<LoopMotionType>> = {
  ...loopBaseVariants,
  ...loopPulseVariants,
  ...loopFloatVariants,
  ...loopRotateVariants,
  ...loopElasticVariants,
}
