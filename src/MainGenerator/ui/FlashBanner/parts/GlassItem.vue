<!-- src/MainGenerator/ui/FlashBanner/parts/GlassItem.vue -->
<template>
  <div
    class="flex items-center min-h-12 rounded-full overflow-hidden gap-3 px-4 py-2"
    :class="[uiMap.bubble.class, settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row']"
    :style="{ ...uiMap.bubble.style, ...glassOverlay }"
  >
    <!-- ラベル -->
    <div
      v-if="settings.label"
      class="shrink-0 font-bold text-xl p-2 rounded-2xl opacity-80"
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
  import { computed } from 'vue'
  import type { CharacterColorType, FlashBannerType } from '@/types/OmikujiData/'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { createUiMap } from '@main/ui/CommentBubble/composables/UiBubbleMap'
  import { useMessageTransition } from './useMessageTransition'
  import { useFlashScroll } from './useFlashScroll'

  const props = defineProps<{
    settings: FlashBannerType
    message: string
    layers: string[]
    color: CharacterColorType
    labelClass?: string
  }>()

  const uiMap = computed(() => createUiMap({ color: props.color }))

  const glassOverlay = {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.10)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    opacity: '0.92',
  }

  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.layers.length > 0)

  const { displayMessage, wrapperRef } = useMessageTransition(() => props.message)

  const { textRef, containerRef, scrollClass, scrollDuration } = useFlashScroll({
    getMessage: () => props.message,
    getSettings: () => props.settings,
  })

  const scrollStyle = computed(() => ({ '--scroll-duration': `${scrollDuration.value}s` }))
</script>

<style scoped>
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
