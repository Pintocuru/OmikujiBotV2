// src/types/MetaMaps/loopMotionMaps.ts
export interface LoopMotionConfig {
  label: string
  variant: string // すべてCSSクラス名に統一
  kind: 'none' | 'css'
}

export const loopMotionMap = {
  none: { label: 'なし', variant: '', kind: 'none' },
  bounce: { label: 'バウンド', variant: 'animate__bounce', kind: 'css' },
  shake: { label: '小刻みシェイク', variant: 'animate__shakeX', kind: 'css' },
  swing: { label: '左右揺れ', variant: 'animate__swing', kind: 'css' },
  wobble: { label: '大きく揺れ', variant: 'animate__wobble', kind: 'css' },
  rotate: { label: '回転（時計回り）', variant: 'anim__rotate', kind: 'css' },
  rotateR: { label: '逆回転', variant: 'anim__rotateR', kind: 'css' },
  rubberBand: { label: 'ゴムバンド', variant: 'animate__rubberBand', kind: 'css' },
  jello: { label: 'ゼリー', variant: 'animate__jello', kind: 'css' },
  tilt: { label: '傾き', variant: 'anim__tilt', kind: 'css' },
  headShake: { label: '首振り', variant: 'anim__headShake', kind: 'css' },
  pulse: { label: '点滅', variant: 'animate__pulse', kind: 'css' },
  flash: { label: '高速明滅', variant: 'animate__flash', kind: 'css' },
  tada: { label: 'タダ！', variant: 'animate__tada', kind: 'css' },
  combo: { label: 'よろこび', variant: 'anim__combo', kind: 'css' },
  joyful: { label: 'ぴょこぴょこ', variant: 'anim__joyful', kind: 'css' },
  gentle: { label: 'ゆったり（呼吸）', variant: 'anim__gentle', kind: 'css' },
} as const satisfies Record<string, LoopMotionConfig>
