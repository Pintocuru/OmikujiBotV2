<!-- src/MainGenerator/ui/CommentSpin/layouts/Standard.vue -->
<template>
  <div class="flex flex-col items-center">
    <!-- タイトルロゴ -->
    <div class="relative grid max-w-[400px] min-w-[200px]" :style="{ width: `${size.width}px` }">
      <div
        v-for="(src, i) in logoPath"
        :key="i"
        class="col-start-1 row-start-1"
        :style="{ zIndex: logoPath.length - i }"
      >
        <CharacterLayer class="w-full h-auto block" :src="getImagePath(src)" />
      </div>
    </div>

    <!-- スロット -->
    <div
      class="relative rounded-xl shadow-lg border-4 overflow-hidden bg-base-200"
      :class="[`border-${color.backFrom}`]"
      :style="{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }"
    >
      <!-- 左右マーカー -->
      <div class="absolute left-2 top-1/2 -translate-y-1/2 text-xl opacity-60" :class="[`text-${color.backFrom}`]">
        ▶
      </div>
      <div class="absolute right-2 top-1/2 -translate-y-1/2 text-xl opacity-60" :class="[`text-${color.backFrom}`]">
        ◀
      </div>

      <!-- スロット -->
      <div class="absolute inset-0 flex items-center justify-center overflow-hidden px-10">
        <!-- 回転中 -->
        <div
          v-if="isSpinning && slotMessages.length"
          ref="slotTrackRef"
          class="absolute top-0 left-0"
          :class="trackClass"
        >
          <div
            v-for="msg in slotMessages"
            :key="msg.id"
            class="flex items-center justify-center shrink-0 px-2"
            :style="itemStyle"
          >
            <StandardMessage :message="msg.bubble.message" />
          </div>
        </div>

        <!-- 確定 -->
        <div
          v-else-if="resolvedMessage"
          ref="resolvedRef"
          class="flex items-center justify-center w-full px-2"
          :style="{ height: `${size.height}px` }"
        >
          <StandardMessage :message="resolvedMessage.bubble.message" />
        </div>

        <!-- フォールバック -->
        <div v-else class="w-full h-full flex items-center justify-center text-base-content/30 text-7xl">?</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getImagePath, type BotMessageBubbleType, type spinAnimation } from '@/types'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import StandardMessage from './StandardMessage.vue'
  import { useSpinSlot } from './composables/useSpinSlot'
  import CharacterLayer from '@/common/LayerImage/CharacterLayer.vue'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    logoPath: string[]
    isSpinning: boolean
    slotMessages: BotMessageBubbleType[]
    resolvedMessage: BotMessageBubbleType | null
    size: { width: number; height: number }
    animation: spinAnimation
  }>()

  const emit = defineEmits<{
    'animation-ready': [el: HTMLElement, itemHeight: number]
    'animation-end': []
  }>()

  const { slotTrackRef, resolvedRef, trackClass, itemStyle } = useSpinSlot({
    isSpinning: () => props.isSpinning,
    resolvedMessage: () => props.resolvedMessage,
    size: () => props.size,
    animation: () => props.animation,
    emit: (event, el, itemSize) => emit(event, el, itemSize),
  })
</script>
