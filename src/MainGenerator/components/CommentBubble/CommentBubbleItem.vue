<!-- src\MainGenerator\components\CommentBubble\CommentBubbleItem.vue -->
<template>
  <div
    class="relative inline-block max-w-2xl min-w-[10rem]"
    :class="[customClasses, brightnessClass]"
    :style="{
      backgroundColor: props.color?.backgroundColor || '#212121',
      '--bubble-bg': props.color?.backgroundColor || '#212121',
    }"
  >
    <!-- 名前表示 -->
    <div
      v-if="name && name !== ''"
      class="font-semibold"
      :class="textSizeClass"
      :style="{ color: color?.nameColor || '#ccc' }"
    >
      {{ name }}
    </div>

    <!-- コメント内容 -->
    <div class="break-words" :class="textSizeClass" :style="{ color: color?.textColor || '#ccc' }">
      {{ displayed }}
    </div>

    <!-- 吹き出しの矢印 -->
    <div :class="[customArrowClasses, brightnessClass]" :style="{ borderTopColor: 'var(--bubble-bg)' }" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'
  import { DisplaySize } from '@shared/types'

  const props = withDefaults(
    defineProps<{
      name?: string
      comment: string
      color?: CharacterColorType
      textSize?: DisplaySize
      brightnessLevel?: number // brightness値をレベルとして受け取る
      customClasses?: string
      customArrowClasses?: string
      animatedText?: boolean
      animatedTextSpeed?: number
    }>(),
    {
      name: '',
      comment: '',
      textSize: 'md',
      brightnessLevel: 0, // デフォルトは最も明るい
      customClasses: 'p-4 rounded-xl',
      customArrowClasses:
        'absolute w-0 h-0 -bottom-5 left-1/2 -translate-x-1/2 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent',
      animatedText: false,
      animatedTextSpeed: 50,
    }
  )

  // テキストサイズのクラス定義
  const TEXT_SIZE_CLASSES = {
    xs: 'text-md',
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  } as const

  // brightnessレベルに応じたクラス
  const BRIGHTNESS_CLASSES = [
    '', // レベル0: 通常の明度
    'brightness-90', // レベル1: 少し暗く
    'brightness-75', // レベル2: より暗く
    'brightness-50', // レベル3: 半分の明度
    'brightness-[30%]', // レベル4以上: 最も暗く
  ] as const

  // アニメーション用のテキスト
  const displayed = ref(props.animatedText ? '' : props.comment)

  // テキストの大きさ
  const textSizeClass = computed(() => TEXT_SIZE_CLASSES[props.textSize])

  // brightnessクラス
  const brightnessClass = computed(() => {
    const level = Math.min(props.brightnessLevel, BRIGHTNESS_CLASSES.length - 1)
    return BRIGHTNESS_CLASSES[level]
  })

  // 文字送り用
  watchEffect(() => {
    if (!props.animatedText) {
      displayed.value = props.comment
      return
    }

    displayed.value = ''
    let i = 0
    const timer = setInterval(() => {
      displayed.value = props.comment.substring(0, i++)
      if (i > props.comment.length) clearInterval(timer)
    }, props.animatedTextSpeed)
  })
</script>
