// src/MainGenerator/ui/FlashBanner/composables/useDelayedBlink.ts
import { ref, watch } from 'vue'

export interface UseDelayedBlinkOptions {
  transitionDuration?: number // Transitionアニメーションの完了待ち時間（ミリ秒）
  blinkDuration?: number // ブリンクアニメーションの継続時間（ミリ秒）
  blinkClassName?: string // ブリンク用のCSSクラス名
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
    blinkClass, // ブリンク用CSSクラス（要素にバインド）
    blinkTrigger, // ブリンクトリガー値（props経由で渡す場合に使用）
    triggerBlink, // 手動でブリンクを実行
    setupBlinkWatcher, // トリガー値の監視を設定
    incrementTrigger, // トリガー値をインクリメント
  }
}
