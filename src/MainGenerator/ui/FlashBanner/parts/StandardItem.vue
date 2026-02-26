<!-- src/MainGenerator/ui/FlashBanner/parts/StandardItem.vue -->
<template>
  <div
    class="flex items-center min-h-18 rounded-lg shadow-lg overflow-hidden gap-4 px-4"
    :class="[uiMap.bubble.class, settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row']"
    :style="uiMap.bubble.style"
  >
    <!-- ラベル（親からクラスを受け取る） -->
    <div v-if="settings.label" class="font-bold text-xl" :class="labelClass" :style="uiMap.name.style">
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="flex-shrink-0 flex items-center">
      <LayerImage :layers="layers" :size="settings.iconSize" />
    </div>

    <!-- スクロールテロップ -->
    <div ref="textContainerRef" class="flex-1 overflow-hidden px-4 min-w-0 bg-base-200 text-base-content rounded-lg">
      <div :class="['message-wrapper', isAnimating ? 'message-exit' : 'message-enter']">
        <span
          ref="textRef"
          class="inline-block whitespace-nowrap font-bold text-5xl"
          :class="[uiMap.text.class, { 'animate-scroll': shouldScroll }]"
          :style="uiMap.text.style"
          v-html="displayMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
  import { CharacterColorType, SettingsFlashBannerType } from '@/types/OmikujiData/'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { createUiMap } from '@main/ui/CommentBubble/composables/UiBubbleMap'
  import { useMessageTransition } from './useMessageTransition'

  // Props
  const props = defineProps<{
    settings: SettingsFlashBannerType
    message: string
    layers: string[]
    color: CharacterColorType
    labelClass?: string
  }>()

  // UI Styling
  const uiMap = computed(() => createUiMap({ color: props.color }))
  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.layers.length > 0)

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
  const { displayMessage } = useMessageTransition(() => props.message)

  watch(() => displayMessage.value, checkScrollNeeded, { immediate: true })

  // Resize Observer
  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    checkScrollNeeded()

    if (textContainerRef.value) {
      resizeObserver = new ResizeObserver(checkScrollNeeded)
      resizeObserver.observe(textContainerRef.value)
    }
  })

  // Message Change Animation
  const isAnimating = ref(false)

  watch(
    () => props.message,
    async (newVal) => {
      if (newVal === displayMessage.value) return

      // フェードアウト
      isAnimating.value = true
      await new Promise((resolve) => setTimeout(resolve, 200))

      // メッセージ差し替え＆スクロール判定リセット
      displayMessage.value = newVal
      shouldScroll.value = false
      await checkScrollNeeded()

      // フェードイン
      isAnimating.value = false
    }
  )

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

  /* メッセージ切り替えアニメーション */
  .message-wrapper {
    display: flex;
    align-items: center;
  }

  .message-enter {
    animation: msg-in 0.25s ease-out both;
  }

  .message-exit {
    animation: msg-out 0.2s ease-in both;
  }

  @keyframes msg-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes msg-out {
    to {
      opacity: 0;
      transform: translateY(-6px);
    }
  }
</style>
