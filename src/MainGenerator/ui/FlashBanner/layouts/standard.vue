<!-- src/MainGenerator/ui/FlashBanner/layouts/standard.vue -->
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
    <div ref="containerRef" class="flex-1 overflow-hidden px-4 min-w-0 bg-base-200 text-base-content rounded-lg">
      <div :class="['message-wrapper', isAnimating ? 'message-exit' : 'message-enter']">
        <span
          ref="textRef"
          class="inline-block whitespace-nowrap font-bold text-5xl"
          :class="[uiMap.text.class, scrollClass]"
          :style="[uiMap.text.style, scrollStyle]"
          v-html="displayMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { CharacterColorType, FlashBannerType } from '@/types/OmikujiData/'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { createUiMap } from '@main/ui/CommentBubble/composables/UiBubbleMap'
  import { useMessageTransition } from '../composables/useMessageTransition'
  import { useFlashScroll } from '../composables/useFlashScroll'

  const props = defineProps<{
    settings: FlashBannerType
    message: string
    layers: string[]
    color: CharacterColorType
    labelClass?: string
  }>()

  const uiMap = computed(() => createUiMap({ color: props.color }))
  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.layers.length > 0)

  const { displayMessage } = useMessageTransition(() => props.message)

  const { textRef, containerRef, scrollClass, scrollDuration, checkScrollNeeded } = useFlashScroll({
    getMessage: () => props.message,
    getSettings: () => props.settings,
  })

  // duration を CSS カスタムプロパティで渡す
  const scrollStyle = computed(() => ({ '--scroll-duration': `${scrollDuration.value}s` }))

  // Message Change Animation
  const isAnimating = ref(false)

  watch(
    () => props.message,
    async (newVal) => {
      if (newVal === displayMessage.value) return

      isAnimating.value = true
      await new Promise((resolve) => setTimeout(resolve, 200))

      displayMessage.value = newVal
      await checkScrollNeeded()

      isAnimating.value = false
    }
  )
</script>

<style scoped>
  /* loop モード */
  .animate-scroll-loop {
    animation: ticker-scroll var(--scroll-duration, 14s) linear infinite;
  }

  /* fade モード */
  .animate-scroll-fade {
    animation: ticker-scroll-fade var(--scroll-duration, 14s) linear infinite;
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

  @keyframes ticker-scroll-fade {
    0%,
    5% {
      opacity: 1;
      transform: translateX(0);
    }
    70% {
      opacity: 1;
      transform: translateX(-60%);
    }
    80% {
      opacity: 0;
      transform: translateX(-60%);
    }
    85% {
      opacity: 0;
      transform: translateX(0);
    }
    95%,
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

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
