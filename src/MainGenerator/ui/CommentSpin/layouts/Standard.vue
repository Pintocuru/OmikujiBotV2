<!-- src/MainGenerator/ui/CommentSpin/layouts/Standard.vue -->
<template>
  <div class="flex flex-col items-center">
    <div
      class="relative h-24 min-w-sm rounded-lg shadow-lg border-2"
      :class="[`border-${color.backTo}`, `bg-${color.backFrom}`]"
    >
      <!-- 矢印 -->
      <span
        class="absolute left-1.5 top-1/2 -translate-y-1/2 text-base opacity-80 z-10"
        :class="`text-${color.backTo}`"
      >
        ◀
      </span>
      <span
        class="absolute right-1.5 top-1/2 -translate-y-1/2 text-base opacity-80 z-10"
        :class="`text-${color.backTo}`"
      >
        ▶
      </span>

      <div class="absolute inset-0 overflow-hidden flex items-center justify-center px-7">
        <!-- スロット回転中 -->
        <div
          v-if="isSpinning && slotMessages.length"
          ref="slotTrackRef"
          class="absolute top-0 left-0 w-full flex flex-col items-center"
        >
          <div
            v-for="msg in slotMessages"
            :key="msg.id"
            class="h-24 flex items-center justify-center whitespace-nowrap text-5xl font-bold tracking-wide"
            :class="`text-${color.backTo}`"
          >
            {{ msg.bubble.message }}
          </div>
        </div>

        <!-- 確定表示 -->
        <div
          v-else-if="resolvedMessage"
          ref="resolvedRef"
          class="h-24 flex items-center justify-center whitespace-nowrap text-5xl font-bold tracking-wide"
          :class="`text-${color.backTo}`"
        >
          {{ resolvedMessage.bubble.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    isSpinning: boolean
    slotMessages: BotMessageBubbleType[]
    resolvedMessage: BotMessageBubbleType | null
  }>()

  const emit = defineEmits<{
    'animation-ready': [el: HTMLElement]
    'animation-end': []
  }>()

  const slotTrackRef = ref<HTMLElement | null>(null)
  const resolvedRef = ref<HTMLElement | null>(null)

  // スロット開始通知
  watch(
    () => props.isSpinning,
    async (val) => {
      if (!val) return
      await nextTick()
      if (slotTrackRef.value) emit('animation-ready', slotTrackRef.value)
    }
  )

  // 確定フェードイン
  watch(
    () => props.resolvedMessage,
    async () => {
      await nextTick()
      if (!resolvedRef.value) return
      resolvedRef.value.animate(
        [
          { opacity: '0', transform: 'translateY(6px)' },
          { opacity: '1', transform: 'translateY(0)' },
        ],
        { duration: 350, easing: 'ease', fill: 'forwards' }
      )
    }
  )
</script>
