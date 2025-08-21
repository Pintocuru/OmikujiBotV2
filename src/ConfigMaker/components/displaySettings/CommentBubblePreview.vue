<!-- src/ConfigMaker/components/parts/CommentBubblePreview.vue -->
<template>
  <div class="cursor-pointer" :class="fontClass" @click="reloadAnimation" @contextmenu.prevent="hideAnimation">
    <!-- MotionWrapperを使用してシンプルに -->
    <MotionWrapper
      ref="motionWrapper"
      v-model:visible="shouldShowBubble"
      :enter-motion="bubbleMotionEnter"
      :leave-motion="bubbleMotionLeave"
      :auto-hide="false"
    >
      <CommentBubble
        name="テストユーザー"
        :comment="currentPreview"
        :color="color"
        :text-size="textSize"
        :custom-classes="customClasses"
      />
    </MotionWrapper>

    <div class="flex justify-center mt-6">
      <button class="btn btn-ghost btn-sm" @click.stop="reloadAnimation">再表示</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { FontFamilyType, useFontFamily } from '@/types/BotComponents/useFontFamily'
  import { MotionType } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
  import CommentBubble from '@MainComponents/OmikujiBot/CommentBubble.vue'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import type { DisplaySize } from '@shared/types'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'

  // Props定義（元のコンポーネントと同じ）
  interface Props {
    color: CharacterColorType
    textSize?: DisplaySize
    customClasses?: string | undefined
    fontFamily?: FontFamilyType
    bubbleMotionEnter?: MotionType
    bubbleMotionLeave?: MotionType
  }

  const props = withDefaults(defineProps<Props>(), {
    textSize: 'md',
    fontFamily: 'default',
    bubbleMotionEnter: 'slideUp',
    bubbleMotionLeave: 'slideUp',
  })

  // フォントクラスの算出
  const fontClass = computed(() => useFontFamily(props.fontFamily))

  // MotionWrapperの参照
  const motionWrapper = ref<InstanceType<typeof MotionWrapper>>()

  // アニメーション表示フラグ
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

  // アニメーションのリロード関数（大幅に簡素化！）
  const reloadAnimation = async () => {
    // メッセージを切り替え
    switchPreview()

    // MotionWrapperのreload関数を呼び出すだけ
    await motionWrapper.value?.reload()
  }

  // 右クリックでアニメーションを非表示にする関数（大幅に簡素化！）
  const hideAnimation = async () => {
    // MotionWrapperのhide関数を呼び出すだけ
    await motionWrapper.value?.hide()
  }

  // プレビュー表示をランダムに切り替える関数
  const switchPreview = () => {
    const currentIndex = previewDataList.indexOf(currentPreview.value)
    let newIndex = currentIndex

    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * previewDataList.length)
    }

    currentPreview.value = previewDataList[newIndex]
  }
</script>

<style scoped>
  @import url('../../../../assets/styles/styles.css');
</style>
