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
        class="absolute top-0 left-0 w-full flex flex-col"
      >
        <div
          v-for="msg in slotMessages"
          :key="msg.id"
          class="flex items-center justify-center gap-3 shrink-0"
          :style="{ height: `${size.height}px` }"
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
      <div
        v-else
        class="flex items-center justify-center w-full h-full text-7xl opacity-30"
        :style="{ height: `${size.height}px` }"
      >
        ?
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import CharacterSlot from '../parts/CharacterSlot.vue'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    isSpinning: boolean
    slotMessages: BotMessageBubbleType[]
    resolvedMessage: BotMessageBubbleType | null
    characters: Record<string, CharacterType>
    size: { width: number; height: number }
  }>()

  const emit = defineEmits<{
    'animation-ready': [el: HTMLElement, itemHeight: number]
    'animation-end': []
  }>()

  const slotTrackRef = ref<HTMLElement | null>(null)
  const resolvedRef = ref<HTMLElement | null>(null)

  // 高さから画像サイズを算出（高さの 70% 程度）
  const imageSize = computed(() => Math.floor((props.size.height * 1) / 4))

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
