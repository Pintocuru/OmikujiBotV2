<!-- src/ConfigMaker/components/parts/CommentBubblePreview.vue -->
<template>
  <div class="cursor-pointer" :class="fontClass" @click="reloadAnimation">
    <div v-if="shouldShowBubble" v-motion="animationConfig">
      <CommentBubble
        name="テストユーザー"
        :comment="currentPreview"
        :color="color"
        :text-size="textSize"
        :custom-classes="customClasses"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, watch } from 'vue'
  import { FontFamilyType, useFontFamily } from '@/types/BotComponents/useFontFamily'
  import { MotionType, motionVariants } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
  import CommentBubble from '@MainComponents/OmikujiBot/CommentBubble.vue'
  import type { DisplaySize } from '@shared/types'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'

  // Props定義
  interface Props {
    color: CharacterColorType
    textSize: DisplaySize
    customClasses?: string | undefined
    fontFamily?: FontFamilyType
    bubbleAnimation?: MotionType
  }

  const props = withDefaults(defineProps<Props>(), {
    fontFamily: 'system',
    bubbleAnimation: 'slideUp',
  })

  // フォントクラスの算出
  const fontClass = computed(() => useFontFamily(props.fontFamily))

  // アニメーション設定の算出
  const animationConfig = computed(() => motionVariants[props.bubbleAnimation])

  // アニメーションのリロード用フラグ
  const shouldShowBubble = ref(true)

  // プレビュー用のサンプルデータ配列
  const previewDataList = [
    'これはプレビュー表示です。実際のコメント表示と同じスタイルで確認できます。',
    'カラー設定の確認をしています！文字の見やすさはいかがでしょうか？',
    '背景色と文字色のコントラストがしっかりと取れているか確認してくださいね。',
    'グラデーションやボーダーなど、カスタムクラスでさらにおしゃれにできます✨',
    'クリックするたびに違うメッセージが表示されるよ！試してみてね♪',
    'この吹き出しのデザインは本番環境と同じものです。安心してお使いください。',
  ]

  // 現在表示中のプレビューデータ
  const currentPreview = ref(previewDataList[0])

  // アニメーションのリロード関数
  const reloadAnimation = async () => {
    // メッセージも切り替え
    switchPreview()

    // アニメーションのリロード
    shouldShowBubble.value = false
    await nextTick()
    shouldShowBubble.value = true
  }

  // bubbleAnimation の変更を監視
  watch(
    () => props.bubbleAnimation,
    async () => {
      // 変更があったときにアニメーションをリロード
      shouldShowBubble.value = false
      await nextTick()
      shouldShowBubble.value = true
    }
  )

  // プレビュー表示をランダムに切り替える関数
  const switchPreview = () => {
    // 現在のインデックスを取得
    const currentIndex = previewDataList.indexOf(currentPreview.value)
    let newIndex = currentIndex

    // 現在のインデックスとは異なるランダムなインデックスを取得
    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * previewDataList.length)
    }

    currentPreview.value = previewDataList[newIndex]
  }
</script>

<style scoped>
  /* Google Fonts 読み込み */
  @import url('https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=Mochiy+Pop+P+One&family=Noto+Sans+JP:wght@400;700&family=RocknRoll+One&family=Zen+Maru+Gothic:wght@700;900&display=swap');

  /* 共通の container 用フォントクラス */
  .font-system {
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
  }

  .font-noto-sans {
    font-family: 'Noto Sans JP', sans-serif;
  }

  .font-rounded {
    font-family: 'Kosugi Maru', 'Zen Maru Gothic', sans-serif;
  }

  .font-gothic {
    font-family: 'RocknRoll One', sans-serif;
  }

  .font-mochiy {
    font-family: 'Mochiy Pop P One', sans-serif;
  }
</style>
