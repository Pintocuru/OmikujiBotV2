<!-- src/MainGenerator/ui/CommentSpin/layouts/Standard.vue -->
<template>
  <!-- 外枠: color.backFrom でボーダー、背景は base-200 -->
  <div
    class="relative rounded-xl shadow-lg border-4 overflow-hidden bg-base-200"
    :class="[`border-${color.backFrom}`]"
    :style="{
      width: `${size.width}px`,
      height: `${size.height}px`,
    }"
  >
    <!-- 左右の三角マーカー -->
    <div class="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-xl opacity-60" :class="[`text-${color.backFrom}`]">
      ▶
    </div>
    <div class="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-xl opacity-60" :class="[`text-${color.backFrom}`]">
      ◀
    </div>

    <!-- 上下グラデフェード（覗き窓の演出） -->
    <div class="absolute inset-x-0 top-0 h-6 z-10 bg-gradient-to-b from-base-200 to-transparent pointer-events-none" />
    <div
      class="absolute inset-x-0 bottom-0 h-6 z-10 bg-gradient-to-t from-base-200 to-transparent pointer-events-none"
    />

    <!-- スロット本体 -->
    <div class="absolute inset-0 flex items-center justify-center overflow-hidden px-10">
      <!-- 回転中 -->
      <div
        v-if="isSpinning && slotMessages.length"
        ref="slotTrackRef"
        class="absolute top-0 left-0 w-full flex flex-col"
      >
        <div
          v-for="msg in slotMessages"
          :key="msg.id"
          class="flex items-center justify-center shrink-0"
          :style="{ height: `${size.height}px` }"
        >
          <span class="font-bold tracking-widest text-base-content truncate" :style="{ fontSize: `${fontSize}px` }">
            {{ msg.bubble.message }}
          </span>
        </div>
      </div>

      <!-- 確定表示 -->
      <div
        v-else-if="resolvedMessage"
        ref="resolvedRef"
        class="flex items-center justify-center w-full"
        :style="{ height: `${size.height}px` }"
      >
        <span class="font-bold tracking-widest text-base-content truncate" :style="{ fontSize: `${fontSize}px` }">
          {{ resolvedMessage.bubble.message }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const MAX_CHARS = 10
  const FONT_SIZE_BASE = 48

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    isSpinning: boolean
    slotMessages: BotMessageBubbleType[]
    resolvedMessage: BotMessageBubbleType | null
    size: { width: number; height: number }
  }>()

  const emit = defineEmits<{
    'animation-ready': [el: HTMLElement, itemHeight: number]
    'animation-end': []
  }>()

  const slotTrackRef = ref<HTMLElement | null>(null)
  const resolvedRef = ref<HTMLElement | null>(null)

  // 文字数に応じてフォントサイズを縮小（MAX_CHARS超で比例縮小）
  const fontSize = computed(() => {
    const maxLen = Math.max(
      ...(props.slotMessages.length
        ? props.slotMessages.map((m) => m.bubble.message.length)
        : [props.resolvedMessage?.bubble.message.length ?? 1])
    )
    if (maxLen <= MAX_CHARS) return FONT_SIZE_BASE
    return Math.max(20, Math.floor(FONT_SIZE_BASE * (MAX_CHARS / maxLen)))
  })

  watch(
    () => props.isSpinning,
    async (val) => {
      if (!val) return
      await nextTick()
      if (slotTrackRef.value) emit('animation-ready', slotTrackRef.value, props.size.height)
    }
  )

  watch(
    () => props.resolvedMessage,
    async () => {
      await nextTick()
      if (!resolvedRef.value) return
      resolvedRef.value.animate(
        [
          { opacity: '0', transform: 'scale(0.85)' },
          { opacity: '1', transform: 'scale(1)' },
        ],
        { duration: 300, easing: 'ease-out', fill: 'forwards' }
      )
    }
  )
</script>
