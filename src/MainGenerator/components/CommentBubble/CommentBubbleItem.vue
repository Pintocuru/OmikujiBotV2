<!-- src\MainGenerator\components\CommentBubble\CommentBubbleItem.vue -->
<template>
  <div
    class="relative inline-block max-w-2xl min-w-[10rem]"
    :data-theme="color?.isTheme ? color.daisyUiTheme : null"
    :class="[
      customClasses,
      brightnessClass,
      // テーマモードのときだけ DaisyUI グラデーション背景を適用
      color?.isTheme ? ['bg-gradient-to-br', `from-${color.backFrom}`, `to-${color.backTo}`] : '',
    ]"
    :style="
      !color?.isTheme
        ? {
            backgroundColor: color?.backgroundColor || '#212121',
            '--bubble-bg': color?.backgroundColor || '#212121',
          }
        : {}
    "
  >
    <!-- 名前表示 -->
    <div
      v-if="botName && botName !== ''"
      class="font-bold"
      :style="!color?.isTheme ? { color: color?.nameColor || '#ccc' } : {}"
      :class="[textSizeClass, color?.isTheme ? 'badge mb-2 text-base-content' : '']"
    >
      {{ botName }}
    </div>

    <!-- コメント内容 -->
    <div
      class="break-words"
      :style="!color?.isTheme ? { color: color?.textColor || '#ccc' } : {}"
      :class="[textSizeClass, color?.isTheme ? 'text-primary-content' : '']"
    >
      {{ displayed }}
    </div>

    <!-- 吹き出しの矢印 -->
    <div
      :class="[customArrowClasses, brightnessClass, color?.isTheme ? `border-t-${color.backTo}` : '']"
      :style="!color?.isTheme ? { borderTopColor: 'var(--bubble-bg)' } : {}"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'

  const props = withDefaults(
    defineProps<{
      botName?: string
      message: string
      color?: CharacterColorType
      brightnessLevel?: number
      customClasses?: string
      customArrowClasses?: string
      animatedText?: boolean
      animatedTextSpeed?: number
    }>(),
    {
      botName: '',
      message: '(未記入)',
      brightnessLevel: 0,
      customClasses: 'p-4 rounded-xl',
      customArrowClasses:
        'absolute w-0 h-0 -bottom-5 left-1/2 -translate-x-1/2 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent',
      animatedText: false,
      animatedTextSpeed: 50,
    }
  )

  const color = computed(() => props.color)

  // DaisyUI テーマ時の背景
  const themeBackgroundClass = computed(() => {
    if (!color.value?.isTheme) return ''
    return 'bg-base-200' // 必要なら bg-primary などに変更可能
  })

  // DaisyUI テーマ時の矢印
  const themeArrowClass = computed(() => {
    if (!color.value?.isTheme) return ''
    return 'border-t-base-200'
  })

  // brightness
  const BRIGHTNESS_CLASSES = ['', 'brightness-90', 'brightness-75', 'brightness-50', 'brightness-[30%]'] as const

  const brightnessClass = computed(() => {
    const level = Math.min(props.brightnessLevel, BRIGHTNESS_CLASSES.length - 1)
    return BRIGHTNESS_CLASSES[level]
  })

  // テキストサイズ
  const textSizeClass = computed(() => 'text-xl')

  // アニメーション
  const displayed = ref(props.animatedText ? '' : props.message)

  watchEffect(() => {
    if (!props.animatedText) {
      displayed.value = props.message
      return
    }

    displayed.value = ''
    let i = 0
    const timer = setInterval(() => {
      displayed.value = props.message.substring(0, i++)
      if (i > props.message.length) clearInterval(timer)
    }, props.animatedTextSpeed)
  })
</script>
