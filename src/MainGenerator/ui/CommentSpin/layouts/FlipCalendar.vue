<!-- src/MainGenerator/ui/CommentSpin/layouts/FlipCalendar.vue -->
<template>
  <div
    class="relative rounded-xl shadow-lg border-4 overflow-hidden bg-base-200 flex items-center justify-center"
    :class="[`border-${color.backFrom}`]"
    :style="{ width: `${size.width}px`, height: `${size.height}px` }"
  >
    <!-- スピン中 -->
    <template v-if="isSpinning && currentMsg">
      <div class="relative [perspective:600px]" :style="{ width: `${imgSize}px`, height: `${imgSize}px` }">
        <!-- calendar -->
        <template v-if="animation === 'calendar'">
          <!-- 下：currentMsg -->
          <div
            class="absolute left-0 overflow-hidden top-1/2 z-10 [transform-origin:bottom_center] [backface-visibility:hidden]"
            :style="{ width: `${imgSize}px`, height: `${imgSize / 2}px` }"
          >
            <CharacterSlot :msg="currentMsg" :characters="characters" :size="size" />
          </div>

          <!-- 上：prevMsg（フリップ中は prevMsg、静止中は currentMsg） -->
          <div
            class="absolute left-0 top-0 z-20 overflow-hidden [transform-origin:bottom_center] [backface-visibility:hidden]"
            :class="{ 'card-top-flip': isFlipping }"
            :style="{ width: `${imgSize}px`, height: `${imgSize / 2}px` }"
          >
            <CharacterSlot :msg="prevMsg ?? currentMsg" :characters="characters" :size="size" />
          </div>
        </template>

        <!-- flip -->
        <template v-else>
          <div
            class="relative [transform-style:preserve-3d] [transform-origin:center]"
            :class="{ 'card-full-flip': isFlipping }"
            :style="{ width: `${imgSize}px`, height: `${imgSize}px` }"
          >
            <!-- 表：prevMsg -->
            <div class="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
              <CharacterSlot v-if="prevMsg" :msg="prevMsg" :characters="characters" :size="size" />
            </div>

            <!-- 裏：currentMsg -->
            <div
              class="absolute inset-0 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
            >
              <CharacterSlot :msg="currentMsg" :characters="characters" :size="size" />
            </div>
          </div>
        </template>
      </div>
    </template>

    <!-- 確定 -->
    <div
      v-else-if="resolvedMessage"
      ref="resolvedRef"
      class="flex items-center justify-center"
      :style="{ width: `${size.width}px`, height: `${size.height}px` }"
    >
      <CharacterSlot :msg="resolvedMessage" :characters="characters" :size="size" />
    </div>

    <!-- fallback -->
    <div v-else class="text-7xl opacity-30">?</div>
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
    animation: Extract<spinAnimation, 'flip' | 'calendar'>
    characters: Record<string, CharacterType>
  }>()

  const emit = defineEmits<{
    'animation-ready': [el: HTMLElement, itemHeight: number]
    'animation-end': []
  }>()

  const { currentIndex, isFlipping, resolvedRef } = useSpinSlot({
    isSpinning: () => props.isSpinning,
    resolvedMessage: () => props.resolvedMessage,
    size: () => props.size,
    animation: () => props.animation,
    slotMessages: () => props.slotMessages,
    emit: (event, el, itemSize) => emit(event, el, itemSize),
  })

  const imgSize = computed(() => Math.min(props.size.width, props.size.height) * 0.8)

  const currentMsg = computed(() => props.slotMessages[currentIndex.value] ?? null)

  const prevMsg = computed(() => {
    const len = props.slotMessages.length
    if (!len) return null
    const prevIdx = (currentIndex.value - 1 + len) % len
    return props.slotMessages[prevIdx]
  })
</script>

<style scoped>
  .card-top-flip {
    animation: calendarFlip 0.2s ease-in forwards;
  }
  @keyframes calendarFlip {
    0% {
      transform: rotateX(0deg);
    }
    100% {
      transform: rotateX(-90deg);
    }
  }

  .card-full-flip {
    animation: coinFlip 0.5s ease-in-out forwards;
  }
  @keyframes coinFlip {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(180deg);
    }
  }
</style>
