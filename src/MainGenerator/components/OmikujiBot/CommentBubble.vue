<!-- src/components/common/CommentBubble.vue -->
<template>
  <div
    class="relative inline-block max-w-3xl min-w-[16rem]"
    :class="[customClasses, brightnessClass]"
    :style="bubbleStyles"
  >
    <!-- 名前表示 -->
    <div v-if="name && name !== ''" class="mb-0" :class="textSizeClass" :style="{ color: color?.nameColor || '#ccc' }">
      {{ name }}
    </div>

    <!-- コメント内容 -->
    <div class="break-words" :class="textSizeClass" :style="{ color: color?.textColor || '#ccc' }">
      {{ displayed }}
    </div>

    <!-- 吹き出しの矢印 -->
    <div
      v-if="showArrow"
      class="absolute w-0 h-0 -bottom-5 left-1/2 -translate-x-1/2 transform"
      :class="brightnessClass"
      :style="arrowStyles"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'
  import { DisplaySize } from '@shared/types'

  interface Props {
    name?: string
    comment: string
    color?: CharacterColorType
    textSize?: DisplaySize
    brightnessLevel?: number // brightness値をレベルとして受け取る
    showArrow?: boolean
    customClasses?: string
    animatedText?: boolean
    animatedTextSpeed?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    comment: '',
    textSize: 'md',
    brightnessLevel: 0, // デフォルトは最も明るい
    showArrow: true,
    customClasses: 'p-4 rounded-xl',
    animatedText: false,
    animatedTextSpeed: 50,
  })

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

  // 吹き出しのスタイル（brightnessを除去）
  const bubbleStyles = computed(() => {
    const baseStyles: Record<string, string> = {}
    baseStyles.backgroundColor = props.color?.backgroundColor || '#212121'
    return baseStyles
  })

  // 矢印のスタイル（brightnessを除去）
  const arrowStyles = computed(() => ({
    borderLeft: '20px solid transparent',
    borderRight: '20px solid transparent',
    borderTop: `20px solid ${props.color?.backgroundColor || '#212121'}`,
  }))

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
