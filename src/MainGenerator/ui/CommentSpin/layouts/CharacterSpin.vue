<!-- src/MainGenerator/ui/CommentSpin/layouts/CharacterSpin.vue -->
<template>
  <div class="relative rounded-xl shadow-lg border-4 overflow-hidden bg-base-200" :class="[`border-${color.backFrom}`]">
    <!-- 下地（LayerImage2） -->
    <LayerImage2 :layers="settings.logoPath" :width="size.width" :height="size.height" class="absolute inset-0" />

    <!-- スロット本体 -->
    <div class="absolute inset-0 overflow-hidden" style="z-index: 1">
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
          class="flex items-center justify-center gap-3 shrink-0"
          :style="itemStyle"
        >
          <CharacterSlot :msg="msg" :size="size" />
        </div>
      </div>

      <!-- 確定表示 -->
      <div
        v-else-if="resolvedMessage"
        :key="resolvedMessage.id"
        ref="resolvedRef"
        class="flex items-center justify-center gap-3 w-full"
        :style="{ height: `${size.height}px` }"
      >
        <CharacterSlot :msg="resolvedMessage" :size="size" />
      </div>

      <!-- フォールバック -->
      <div v-else class="flex items-center justify-center w-full h-full text-7xl opacity-30">?</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { BotMessageBubbleType, CommentSpinType, spinAnimation } from '@/types'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import CharacterSlot from './CharacterSlot.vue'
  import { useSpinSlot } from './composables/useSpinSlot'
  import LayerImage2 from '@/common/LayerImage/LayerImage2.vue'

  const props = defineProps<{
    settings: CommentSpinType
    color: DaisyUiThemeFieldsType
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
