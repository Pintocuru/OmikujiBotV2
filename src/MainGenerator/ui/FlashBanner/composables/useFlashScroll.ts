// src/MainGenerator/ui/FlashBanner/composables/useFlashScroll.ts
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { FlashBannerType } from '@/types/OmikujiData/'

interface UseFlashScrollOptions {
  /** メッセージ（HTMLタグ除去後の長さでduration計算に使用） */
  getMessage: () => string
  /** settings.scrollSpeed / settings.scrollReturnMode を参照 */
  getSettings: () => FlashBannerType
}

const DOM_RENDER_DELAY = 50
const SCROLL_THRESHOLD = 20

/**
 * FlashBanner 共通スクロール制御 Composable
 *
 * 責務:
 *  - テキスト幅 / コンテナ幅取得
 *  - スクロール必要判定 (shouldScroll)
 *  - scrollSpeed ベースの duration 計算 (scrollDuration)
 *  - scrollReturnMode に応じた CSS クラス決定 (scrollClass)
 *  - ResizeObserver によるリサイズ追従
 */
export function useFlashScroll({ getMessage, getSettings }: UseFlashScrollOptions) {
  const textRef = ref<HTMLElement | null>(null)
  const containerRef = ref<HTMLElement | null>(null)
  const shouldScroll = ref(false)
  const scrollDuration = ref(14) // 秒

  // scrollReturnMode に応じたアニメーションクラス
  const scrollClass = ref<'animate-scroll-loop' | 'animate-scroll-fade' | ''>('')

  // --------  幅計測 --------

  const checkScrollNeeded = async () => {
    await nextTick()
    await new Promise<void>((resolve) => setTimeout(resolve, DOM_RENDER_DELAY))

    if (!textRef.value || !containerRef.value) {
      shouldScroll.value = false
      scrollClass.value = ''
      return
    }

    const textWidth = textRef.value.scrollWidth
    const containerWidth = containerRef.value.clientWidth
    const needed = textWidth > containerWidth + SCROLL_THRESHOLD

    if (!needed) {
      shouldScroll.value = false
      scrollClass.value = ''
      return
    }

    shouldScroll.value = true
    const settings = getSettings()

    // scrollSpeed (px/sec) からアニメーション時間を計算
    // 移動距離 = テキスト幅の 60% (ticker-scroll の -60% translateX に対応)
    const scrollDistance = textWidth * 0.6
    const speed = settings.scrollSpeed > 0 ? settings.scrollSpeed : 80
    scrollDuration.value = Math.max(3, scrollDistance / speed)

    // scrollReturnMode に応じたクラス付与
    scrollClass.value = settings.scrollReturnMode === 'fade' ? 'animate-scroll-fade' : 'animate-scroll-loop'
  }

  // --------  メッセージ変更時の再計測 --------

  watch(getMessage, () => {
    shouldScroll.value = false
    scrollClass.value = ''
    checkScrollNeeded()
  })

  // --------  ResizeObserver --------

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    checkScrollNeeded()
    if (containerRef.value) {
      resizeObserver = new ResizeObserver(checkScrollNeeded)
      resizeObserver.observe(containerRef.value)
    }
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  return {
    textRef,
    containerRef,
    shouldScroll,
    scrollDuration,
    scrollClass,
    checkScrollNeeded,
  }
}
