<!-- src/MainGenerator/ui/CommentBubble/parts/CommentBubbleItem.vue -->
<template>
  <div
    class="relative transparent-bg inline-block max-w-3xl min-w-[10rem]"
    :data-theme="uiMap.themeDataAttr"
    :class="uiMap.bubble.class"
    :style="uiMap.bubble.style"
  >
    <!-- 名前表示 -->
    <div v-if="botName" class="font-bold text-xl" :class="uiMap.name.class" :style="uiMap.name.style">
      {{ botName }}
    </div>

    <!-- コメント内容（HTML を描画） -->
    <div class="break-words text-xl" :class="uiMap.text.class" :style="uiMap.text.style" v-html="displayedHtml" />

    <!-- 吹き出しの矢印 -->
    <div :class="uiMap.arrow.class" :style="uiMap.arrow.style" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue'
  import { CharacterColorScheme, CharacterColorType } from '@/types/OmikujiData/'
  import { createUiMap } from '../composables/UiBubbleMap'

  const props = withDefaults(
    defineProps<{
      botName: string | null
      message: string
      color: CharacterColorType
      brightnessLevel?: number
      customClasses?: string
      customArrowClasses?: string
      animatedText?: boolean
      animatedTextSpeed?: number
    }>(),
    {
      color: () => CharacterColorScheme.parse({}),
      brightnessLevel: 0,
      customClasses: 'p-4 rounded-xl',
      customArrowClasses:
        'absolute w-0 h-0 -bottom-5 left-1/2 -translate-x-1/2 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent',
      animatedText: false,
      animatedTextSpeed: 50,
    }
  )

  // Brightness
  const BRIGHTNESS_CLASSES = ['', 'brightness-90', 'brightness-75', 'brightness-50', 'brightness-[30%]'] as const

  const brightness = computed(() => {
    if (props.brightnessLevel == null) return undefined
    return BRIGHTNESS_CLASSES[Math.min(props.brightnessLevel, BRIGHTNESS_CLASSES.length - 1)]
  })

  const uiMap = computed(() =>
    createUiMap({
      color: props.color,
      brightness: brightness.value,
      customClasses: props.customClasses,
      customArrowClasses: props.customArrowClasses,
    })
  )

  // アニメーション
  const displayedHtml = ref(props.animatedText ? '' : props.message)
  const isHtml = computed(() => props.message.includes('<'))

  watchEffect(() => {
    // HTML を含む場合はアニメーション禁止（そのまま表示）
    if (!props.animatedText || isHtml.value) {
      displayedHtml.value = props.message
      return
    }

    // ここから先は「プレーンテキストのみ」アニメーション
    displayedHtml.value = ''
    let i = 0
    const timer = setInterval(() => {
      displayedHtml.value = props.message.substring(0, i++)
      if (i > props.message.length) clearInterval(timer)
    }, props.animatedTextSpeed)
  })
</script>
