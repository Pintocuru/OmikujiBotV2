<!-- src\MainGenerator\ui\FlashBanner\parts\FlashBannerItem.vue -->
<template>
  <div
    v-if="message"
    class="flex items-center w-full min-h-12 rounded-lg shadow-lg overflow-hidden gap-2 px-2"
    :data-theme="dataTheme"
    :class="[uiMap.bubble.class, showCharacterOnRight ? 'flex-row-reverse' : 'flex-row']"
    :style="uiMap.bubble.style"
  >
    <!-- ラベル（親からクラスを受け取る） -->
    <div v-if="label" class="font-bold" :class="labelClass" :style="uiMap.name.style">
      {{ label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="flex-shrink-0 flex items-center">
      <LayerImage :layers="layers" :size="iconSize" />
    </div>

    <!-- スクロールテロップ -->
    <div ref="textContainerRef" class="flex-1 overflow-hidden px-3 min-w-0 bg-base-200 text-base-content rounded-lg">
      <span
        ref="textRef"
        class="inline-block whitespace-nowrap font-bold text-xl"
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
  import { createUiMap } from '../../CommentBubble/composables/UiBubbleMap'

  // Props
  const props = withDefaults(
    defineProps<{
      label: string
      message: string
      layers: string[]
      iconSize?: number
      color: CharacterColorType
      showCharacterOnRight?: boolean
      labelClass?: string // 親から受け取るブリンククラス
    }>(),
    {
      label: '',
      iconSize: 16,
      showCharacterOnRight: false,
      labelClass: '',
    }
  )

  // UI Styling
  const dataTheme = computed(() => props.color?.daisyUiTheme ?? 'light')
  const uiMap = computed(() => createUiMap({ color: props.color }))
  const shouldShowIcon = computed(() => props.iconSize > 0 && props.layers.length > 0)

  // Scroll Detection
  const textRef = ref<HTMLElement | null>(null)
  const textContainerRef = ref<HTMLElement | null>(null)
  const shouldScroll = ref(false)

  const SCROLL_THRESHOLD = 20
  const DOM_RENDER_DELAY = 50

  /** テキストがコンテナに収まるか判定 */
  const checkScrollNeeded = async () => {
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, DOM_RENDER_DELAY))

    if (!textRef.value || !textContainerRef.value) {
      shouldScroll.value = false
      return
    }

    const textWidth = textRef.value.scrollWidth
    const containerWidth = textContainerRef.value.clientWidth

    shouldScroll.value = textWidth > containerWidth + SCROLL_THRESHOLD
  }

  // メッセージ変更時にスクロール判定
  watch(() => props.message, checkScrollNeeded, { immediate: true })

  // Resize Observer
  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    checkScrollNeeded()

    if (textContainerRef.value) {
      resizeObserver = new ResizeObserver(checkScrollNeeded)
      resizeObserver.observe(textContainerRef.value)
    }
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  })
</script>

<style scoped>
  /* テロップスクロール */
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

  /* ラベルブリンク（親から適用される） */
  .blink-animation {
    animation: blink 0.25s ease-in-out 3;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
  }
</style>
