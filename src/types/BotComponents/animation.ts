// types/animation.ts
export const animationLabel = [
  'slideUp', // 現在の下から上へ
  'slideDown', // 上から下へ
  'slideLeft', // 右から左へ
  'slideRight', // 左から右へ
  'flipY', // Y軸フリップ
  'flipX', // X軸フリップ
  'scale', // スケール拡大
  'rotate', // 回転しながら現れる
  'bounce', // バウンスしながら現れる
  'fade', // フェード
] as const
export type AnimationType = (typeof animationLabel)[number]

export interface AnimationConfig {
  enter: {
    duration: number
    easing: string
    delay?: number
  }
  leave: {
    duration: number
    easing: string
    delay?: number
  }
}
