// src/MainGenerator/ui/FlashBanner/composables/useDelayedBlink.ts
import { ref, watch } from 'vue'

export interface UseDelayedBlinkOptions {
  /** Transitionアニメーションの完了待ち時間（ミリ秒） */
  transitionDuration?: number
  /** ブリンクアニメーションの継続時間（ミリ秒） */
  blinkDuration?: number
  /** ブリンク用のCSSクラス名 */
  blinkClassName?: string
}

export function useDelayedBlink(options: UseDelayedBlinkOptions = {}) {
  const { transitionDuration = 350, blinkDuration = 750, blinkClassName = 'blink-animation' } = options

  const blinkClass = ref('')
  const blinkTrigger = ref(0)

  /**
   * ブリンクアニメーションを手動でトリガー
   * @param withDelay Transition完了を待つかどうか
   */
  const triggerBlink = async (withDelay = true) => {
    if (withDelay) {
      // Transitionのアニメーション完了を待つ
      await new Promise((resolve) => setTimeout(resolve, transitionDuration))
    }

    // ブリンク開始
    blinkClass.value = blinkClassName
    await new Promise((resolve) => setTimeout(resolve, blinkDuration))

    // ブリンク終了
    blinkClass.value = ''
  }

  /**
   * トリガー値の監視によるブリンク実行
   * @param triggerValue 監視対象の値
   * @param withDelay Transition完了を待つかどうか
   */
  const setupBlinkWatcher = (triggerValue: () => number, withDelay = true) => {
    watch(triggerValue, async (newVal, oldVal) => {
      if (newVal === oldVal || newVal === 0) return
      await triggerBlink(withDelay)
    })
  }

  /**
   * ブリンクトリガーをインクリメント（手動発火用）
   */
  const incrementTrigger = () => {
    blinkTrigger.value++
  }

  return {
    /** ブリンク用CSSクラス（要素にバインド） */
    blinkClass,
    /** ブリンクトリガー値（props経由で渡す場合に使用） */
    blinkTrigger,
    /** 手動でブリンクを実行 */
    triggerBlink,
    /** トリガー値の監視を設定 */
    setupBlinkWatcher,
    /** トリガー値をインクリメント */
    incrementTrigger,
  }
}
