<!-- src/MainGenerator/ui/CommentSpin/layouts/CharacterSpin.vue -->
<template>
  <div
    class="relative rounded-xl shadow-lg border-4 overflow-hidden bg-base-200"
    :class="[`border-${color.backFrom}`]"
    :style="{
      width: `${size.width}px`,
      height: `${size.height}px`,
    }"
  >
    <!-- スロット本体 -->
    <div class="absolute inset-0 overflow-hidden">
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
          <CharacterSlot :msg="msg" :characters="characters" :size="imageSize" />
        </div>
      </div>

      <!-- 確定表示 -->
      <div
        v-else-if="resolvedMessage"
        ref="resolvedRef"
        class="flex items-center justify-center gap-3 w-full"
        :style="{ height: `${size.height}px` }"
      >
        <CharacterSlot :msg="resolvedMessage" :characters="characters" :size="imageSize" />
      </div>

      <!-- フォールバック -->
      <div v-else class="flex items-center justify-center w-full h-full text-7xl opacity-30">?</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { BotMessageBubbleType, spinAnimation } from '@/types'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import CharacterSlot from './CharacterSlot.vue'
  import { useSpinSlot } from './composables/useSpinSlot'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    isSpinning: boolean
    slotMessages: BotMessageBubbleType[]
    resolvedMessage: BotMessageBubbleType | null
    size: { width: number; height: number }
    animation: spinAnimation
    characters: Record<string, CharacterType>
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

  const imageSize = computed(() => Math.floor(props.size.height / 4))
</script>
