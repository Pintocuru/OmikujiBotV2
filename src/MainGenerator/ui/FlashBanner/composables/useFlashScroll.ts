// src/MainGenerator/ui/FlashBanner/composables/useFlashScroll.ts
import { ref, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'
import type { FlashBannerType } from '@/types/OmikujiData/'

interface UseFlashScrollOptions {
  getMessage: () => string
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
  const scrollDuration = ref(14)
  const scrollClass = ref<'animate-scroll-loop' | 'animate-scroll-fade' | ''>('')

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
    const scrollDistance = textWidth * 0.6
    const speed = settings.scrollSpeed > 0 ? settings.scrollSpeed : 80
    scrollDuration.value = Math.max(3, scrollDistance / speed)
    scrollClass.value = settings.scrollReturnMode === 'fade' ? 'animate-scroll-fade' : 'animate-scroll-loop'
  }

  // watch → watchEffect に変更（依存関係を自動追跡）
  // メッセージが変わったら即スクロール状態をリセットして再計測
  watchEffect(() => {
    getMessage() // 依存として登録
    shouldScroll.value = false
    scrollClass.value = ''
    checkScrollNeeded()
  })

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
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
