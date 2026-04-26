<!-- src/MainGenerator/ui/FlashBanner/layouts/clear.vue -->
<template>
  <div
    class="flex items-center min-h-12 rounded-xl overflow-hidden gap-3 p-2 border border-2 border-base-content/70"
    :class="[settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row']"
  >
    <!-- ラベル -->
    <div
      v-if="settings.label"
      class="badge badge-xl bg-transparent border border-base-content/70 font-bold text-base-content"
    >
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="shrink-0 flex items-center">
      <LayerImage :layers="characterLayers" :size="settings.iconSize" :animation="characterAnimation" />
    </div>

    <!-- メッセージ -->
    <div ref="containerRef" class="flex-1 overflow-hidden min-w-0">
      <div ref="wrapperRef">
        <span
          ref="textRef"
          class="inline-block whitespace-nowrap font-bold text-5xl text-base-content"
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
  import type { CharacterAnimationType, CharacterColorType, FlashBannerType } from '@/types/OmikujiData/'
  import { useMessageTransition } from '../composables/useMessageTransition'
  import { useFlashScroll } from '../composables/useFlashScroll'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  const props = defineProps<{
    settings: FlashBannerType
    message: string
    characterLayers: string[]
    characterAnimation?: CharacterAnimationType
    color: CharacterColorType
    labelClass?: string
  }>()

  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.characterLayers.length > 0)

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
