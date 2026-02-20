<!-- src/MainGenerator/ui/FlashBanner/parts/GlassItem.vue -->
<template>
  <div
    v-if="message"
    class="flex items-center w-full min-h-12 rounded-3xl overflow-hidden gap-3 px-4"
    :data-theme="dataTheme"
    :class="[uiMap.bubble.class, settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row']"
    :style="{ ...uiMap.bubble.style, ...glassOverlay }"
  >
    <!-- ラベル -->
    <div
      v-if="settings.label"
      class="shrink-0 font-bold text-sm px-3 py-1 rounded-2xl opacity-80"
      :class="[labelClass, 'badge', uiMap.name.class]"
      :style="uiMap.name.style"
    >
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="shrink-0 flex items-center">
      <LayerImage :layers="layers" :size="settings.iconSize" />
    </div>

    <!-- メッセージ -->
    <div ref="textContainerRef" class="flex-1 overflow-hidden min-w-0 px-2">
      <span
        ref="textRef"
        class="inline-block whitespace-nowrap font-semibold text-lg"
        :class="[uiMap.text.class, { 'animate-scroll': shouldScroll }]"
        :style="uiMap.text.style"
        v-html="message"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
  import type { CharacterColorType, SettingsFlashBannerType } from '@/types/OmikujiData/'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { createUiMap } from '@main/ui/CommentBubble/composables/UiBubbleMap'

  // Props
  const props = defineProps<{
    settings: SettingsFlashBannerType
    message: string
    layers: string[]
    color: CharacterColorType
    labelClass?: string
  }>()

  const dataTheme = computed(() => props.color?.daisyUiTheme ?? 'light')
  const uiMap = computed(() => createUiMap({ color: props.color }))

  // グラデーション背景はそのままに、ガラス感を上乗せ
  const glassOverlay = {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.10)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    opacity: '0.92',
  }

  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.layers.length > 0)

  // Scroll Detection
  const textRef = ref<HTMLElement | null>(null)
  const textContainerRef = ref<HTMLElement | null>(null)
  const shouldScroll = ref(false)

  const checkScrollNeeded = async () => {
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 50))
    if (!textRef.value || !textContainerRef.value) {
      shouldScroll.value = false
      return
    }
    shouldScroll.value = textRef.value.scrollWidth > textContainerRef.value.clientWidth + 20
  }

  watch(() => props.message, checkScrollNeeded, { immediate: true })

  let resizeObserver: ResizeObserver | null = null
  onMounted(() => {
    checkScrollNeeded()
    if (textContainerRef.value) {
      resizeObserver = new ResizeObserver(checkScrollNeeded)
      resizeObserver.observe(textContainerRef.value)
    }
  })
  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })
</script>

<style scoped>
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
