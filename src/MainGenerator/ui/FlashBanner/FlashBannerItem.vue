<!-- src/MainGenerator/ui/FlashBanner/FlashBannerItem.vue -->
<template>
  <div
    v-if="message"
    class="flex items-center w-full min-h-12 rounded-lg shadow-lg overflow-hidden"
    :data-theme="dataTheme"
    :class="[uiMap.bubble.class, showCharacterOnRight ? 'flex-row-reverse' : 'flex-row']"
    :style="uiMap.bubble.style"
  >
    <!-- アイコン -->
    <div
      v-if="iconSize > 0 && layers.length > 0"
      class="flex-shrink-0 flex items-center"
      :class="showCharacterOnRight ? 'pr-2' : 'pl-2'"
    >
      <LayerImage :layers="layers" :size="iconSize" />
    </div>

    <!-- スクロールテロップ -->
    <div
      ref="textContainerRef"
      class="flex-1 overflow-hidden px-3 min-w-0 bg-base-200 text-base-content rounded-lg mx-2"
    >
      <span
        ref="textRef"
        class="inline-block whitespace-nowrap font-bold text-xl"
        :key="message"
        :class="[uiMap.text.class, { 'animate-scroll': shouldScroll }]"
        :style="uiMap.text.style"
        v-html="message"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
  import { CharacterColorType } from '@/types/OmikujiData/'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  const props = withDefaults(
    defineProps<{
      message: string
      layers: string[]
      iconSize?: number
      color: CharacterColorType
      showCharacterOnRight?: boolean
    }>(),
    {
      iconSize: 16,
      showCharacterOnRight: true,
    }
  )

  // テキスト要素とコンテナの参照
  const textRef = ref<HTMLElement | null>(null)
  const textContainerRef = ref<HTMLElement | null>(null)

  // スクロールが必要かどうかを判定
  const shouldScroll = ref(false)

  // スクロール判定の閾値（ピクセル）
  const SCROLL_THRESHOLD = 20

  /**
   * テキストがコンテナに収まるか判定
   */
  const checkScrollNeeded = async () => {
    // DOMの更新を待つ
    await nextTick()
    // レンダリングの完了をさらに待つ
    await new Promise((resolve) => setTimeout(resolve, 50))

    if (!textRef.value || !textContainerRef.value) {
      shouldScroll.value = false
      return
    }

    const textWidth = textRef.value.scrollWidth
    const containerWidth = textContainerRef.value.clientWidth

    // テキストがコンテナより閾値以上長い場合にスクロール
    shouldScroll.value = textWidth > containerWidth + SCROLL_THRESHOLD
  }

  // メッセージが変わったらスクロール判定
  watch(() => props.message, checkScrollNeeded, { immediate: true })

  // リサイズ対応
  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    // 初期判定
    checkScrollNeeded()

    // コンテナのリサイズを監視（OBSのブラウザソースサイズ変更に対応）
    if (textContainerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        checkScrollNeeded()
      })
      resizeObserver.observe(textContainerRef.value)
    }
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  })

  // isTheme=true のときキャラ側の daisyUiTheme を data-theme に適用
  const dataTheme = computed(() => props.color?.daisyUiTheme ?? 'light')

  const uiMap = computed(() => {
    const isTheme = props.color?.isTheme ?? false
    const bgColor = props.color?.backgroundColor || '#212121'

    return {
      bubble: {
        class: [
          ...(isTheme
            ? [
                `text-${props.color.backFrom}-content`,
                'bg-gradient-to-br',
                `from-${props.color.backFrom}`,
                `to-${props.color.backTo}`,
              ]
            : []),
        ],
        style: isTheme
          ? {}
          : {
              backgroundColor: bgColor,
              '--bubble-bg': bgColor,
            },
      },

      text: {
        class: '',
        style: isTheme ? {} : { color: props.color?.textColor || '#ccc' },
      },
    }
  })
</script>

<style scoped>
  /* 条件付きテロップスクロール */
  .animate-scroll {
    animation: ticker-scroll 14s linear infinite;
  }

  @keyframes ticker-scroll {
    0%,
    10% {
      transform: translateX(0);
    }
    80%,
    90% {
      transform: translateX(-60%);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>
