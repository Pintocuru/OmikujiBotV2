//

export const enterMotionMap = {
  none: 'なし',
  slideUp: '下から上へ',
  slideDown: '上から下へ',
  slideLeft: '右から左へ',
  slideRight: '左から右へ',
  flipInY: 'Y軸フリップ',
  flipX: 'X軸フリップ',
  zoomIn: '拡大しながら現れる',
  scale: 'スケール拡大',
  rotateIn: '回転しながら現れる',
  bounce: 'バウンスしながら現れる',
  rubberBand: 'ゴム的変形',
  jello: 'ゼリー的変形',
  fade: 'フェード',
} as const

export const loopMotionMap = {
  none: 'なし',
  pulse: '拡大縮小の繰り返し',
  breathing: 'ゆっくりとした拡大縮小',
  heartbeat: '心臓の鼓動のような動き',
  floating: '上下に浮遊',
  swing: '左右に揺れる',
  sway: 'ゆらゆら揺れる（rubberBand風）',
  wiggle: '小刻みに揺れる（jello風）',
  rotate: '回転し続ける',
  flipLoop: 'Y軸フリップの繰り返し',
  glow: '明滅',
} as const
