<!-- src/MainGenerator/ui/FlashBanner/parts/ArcadeItem.vue -->
<template>
  <div
    class="flex items-center min-h-18 overflow-hidden gap-4 px-4"
    :class="[uiMap.bubble.class, settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row']"
    :style="{ ...uiMap.bubble.style, ...arcadeContainer }"
  >
    <!-- ラベル：点滅ブロック風 -->
    <div
      v-if="settings.label"
      class="shrink-0 font-black text-lg px-3 py-1 uppercase tracking-widest arcade-label"
      :class="[labelClass, 'badge badge-xl']"
      :style="uiMap.name.style"
    >
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="shrink-0 flex items-center">
      <LayerImage :layers="layers" :size="settings.iconSize" />
    </div>

    <!-- メッセージ -->
    <div ref="containerRef" class="flex-1 overflow-hidden min-w-0">
      <div ref="wrapperRef">
        <span
          ref="textRef"
          class="inline-block text-white whitespace-nowrap font-black text-5xl arcade-text"
          :class="scrollClass"
          :style="scrollStyle"
          v-html="displayMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { CharacterColorType, SettingsFlashBannerType } from '@/types/OmikujiData/'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { createUiMap } from '@main/ui/CommentBubble/composables/UiBubbleMap'
  import { useMessageTransition } from './useMessageTransition'
  import { useFlashScroll } from './useFlashScroll'

  const props = defineProps<{
    settings: SettingsFlashBannerType
    message: string
    layers: string[]
    color: CharacterColorType
    labelClass?: string
  }>()

  const uiMap = computed(() => createUiMap({ color: props.color }))

  const arcadeContainer = {
    borderTop: '3px solid rgba(255,255,255,0.4)',
    borderBottom: '3px solid rgba(0,0,0,0.5)',
  }

  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.layers.length > 0)

  const { displayMessage, wrapperRef } = useMessageTransition(() => props.message, 'slideInRight')

  const { textRef, containerRef, scrollClass, scrollDuration } = useFlashScroll({
    getMessage: () => props.message,
    getSettings: () => props.settings,
  })

  const scrollStyle = computed(() => ({ '--scroll-duration': `${scrollDuration.value}s` }))
</script>

<style scoped>
  /* 縁取り文字 */
  .arcade-text {
    text-shadow:
      -1px -1px 0 rgba(0, 0, 0, 0.8),
      1px -1px 0 rgba(0, 0, 0, 0.8),
      -1px 1px 0 rgba(0, 0, 0, 0.8),
      1px 1px 0 rgba(0, 0, 0, 0.8),
      0 0 12px currentColor;
  }

  /* ラベルのカーソル点滅 */
  .arcade-label {
    animation: cursor-blink 4s step-end infinite;
  }

  @keyframes cursor-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-scroll-loop {
    animation: ticker-scroll var(--scroll-duration, 14s) linear infinite;
  }

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
</style>
