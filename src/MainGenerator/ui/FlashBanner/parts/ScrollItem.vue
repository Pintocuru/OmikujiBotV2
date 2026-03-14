<!-- src/MainGenerator/ui/FlashBanner/parts/TickerItem.vue -->
<template>
  <div class="flex items-center overflow-hidden" :class="[settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row']">
    <!-- ラベルブロック：強調カラー帯 -->
    <div
      v-if="settings.label"
      class="badge badge-xl items-center justify-center font-bold"
      :class="[labelClass]"
      :style="uiMap.name.style"
    >
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="flex items-center px-2 shrink-0">
      <LayerImage :layers="layers" :size="settings.iconSize" />
    </div>

    <!-- テキスト：常時スクロール -->
    <div class="flex-1 overflow-hidden flex items-center">
      <div ref="wrapperRef" class="flex items-center animate-ticker" :style="tickerStyle">
        <span
          v-for="i in repeat"
          :key="i"
          class="inline-block whitespace-nowrap font-bold text-5xl"
          :class="uiMap.text.class"
          :style="spanStyle(i)"
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

  const props = defineProps<{
    settings: SettingsFlashBannerType
    message: string
    layers: string[]
    color: CharacterColorType
    labelClass?: string
  }>()

  const { displayMessage, wrapperRef } = useMessageTransition(() => props.message)

  const uiMap = computed(() => createUiMap({ color: props.color }))
  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.layers.length > 0)

  // テキスト間の空白 (px)
  const GAP_PX = computed(() => {
    const len = props.message.replace(/<[^>]*>/g, '').length
    if (len < 20) return 120
    if (len < 50) return 80
    return 60
  })

  // テキストを何回繰り返すか
  const repeat = computed(() => {
    const len = props.message.replace(/<[^>]*>/g, '').length
    if (len < 15) return 8
    if (len < 40) return 6
    return 4
  })

  /**
   * scrollSpeed (px/sec) ベースでアニメーション duration を計算する。
   *
   * TickerItem は「1セグメント分 (1/repeat) だけ左にずらす」ループ設計のため、
   * 移動距離の見積もりには文字数 × 平均文字幅 (約40px) を使用する。
   * scrollSpeed が 0 以下の場合はデフォルト値 80px/sec を使用する。
   */
  const duration = computed(() => {
    const len = props.message.replace(/<[^>]*>/g, '').length
    const speed = props.settings.scrollSpeed > 0 ? props.settings.scrollSpeed : 80
    // 1セグメントの概算幅 = 文字数 × 40px + GAP
    const segmentWidth = len * 40 + GAP_PX.value
    return Math.max(3, segmentWidth / speed)
  })

  const tickerStyle = computed(() => ({
    willChange: 'transform',
    '--ticker-shift': `calc(-100% / ${repeat.value})`,
    '--ticker-duration': `${duration.value}s`,
  }))

  const glowStyle = computed(() => ({
    textShadow: `0 0 8px currentColor, 0 0 2px currentColor`,
  }))

  const spanStyle = (i: number) => ({
    ...uiMap.value.text.style,
    ...glowStyle.value,
    ...(i > 1 ? { paddingLeft: `${GAP_PX.value}px` } : {}),
  })
</script>

<style scoped>
  .animate-ticker {
    animation: ticker-loop var(--ticker-duration) linear infinite;
  }

  @keyframes ticker-loop {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(var(--ticker-shift));
    }
  }

  .ticker-fade-mask {
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
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
