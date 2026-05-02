// src/common/LayerImage/useCharacterAnimation.ts
import { computed, type Ref } from 'vue'
import { CharacterAnimationType, loopMotionMap } from '@/types'
import 'animate.css'

export function useCharacterAnimation(
  target: Ref<HTMLElement | null>, // 現状 CSS のみなら target は参照のみ、あるいは将来の拡張用
  animation: () => CharacterAnimationType | undefined
) {
  // ─── CSSクラスの判定 ──────────────────────────
  const cssClass = computed(() => {
    const anim = animation()
    if (!anim || anim.type === 'none') return ''

    const entry = loopMotionMap[anim.type as keyof typeof loopMotionMap]
    if (!entry || entry.kind !== 'css') return ''

    // animate.css の基本クラス、マップされたクラス、ループ設定
    return ['animate__animated', entry.variant, anim.loop ? 'animate__infinite' : ''].filter(Boolean).join(' ')
  })

  // ─── アニメーション変数の制御 ────────────────────
  const cssStyle = computed(() => {
    const anim = animation()
    if (!anim || anim.type === 'none') return {}

    const entry = loopMotionMap[anim.type as keyof typeof loopMotionMap]
    if (!entry || entry.kind !== 'css') return {}

    // duration は秒単位(s)で指定
    const duration = anim.duration ?? 1.5

    return {
      '--animate-duration': `${duration}s`,
      '--animate-iteration-count': anim.loop ? 'infinite' : '1',
    }
  })

  // @vueuse/motion (useMotion) は kind: 'motion' がなくなったため削除、
  // もしくは将来的に CSS 以外も扱う可能性があるなら、空の variant を返す形にします。

  return {
    cssClass,
    cssStyle,
  }
}
