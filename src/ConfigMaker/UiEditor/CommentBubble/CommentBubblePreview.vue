<!-- src/ConfigMaker/UiEditor/CommentBubble/CommentBubblePreview.vue -->
<template>
  <div class="flex flex-col items-center space-y-2">
    <!-- プレビュー表示エリア（横幅制限付き） -->
    <div
      class="relative flex flex-col items-center cursor-pointer"
      :class="fontClass"
      :style="{ width: 320 + 'px' }"
      @click="reloadAnimation"
      @contextmenu.prevent="hideAnimation"
    >
      <!-- MotionWrapperを使用してシンプルに -->
      <MotionWrapper
        ref="motionWrapper"
        v-model:visible="shouldShowBubble"
        :motion="bubbleMotionEnter"
        :auto-hide="false"
      >
        <CommentBubbleItem
          :botName="botName"
          :message="currentPreview"
          :color="color"
          :custom-classes="customClasses"
          :animatedText="animatedText"
          :animatedTextSpeed="animatedTextSpeed"
        />
      </MotionWrapper>

      <!-- 再表示ボタン mt-6はフキダシのカギ用 -->
      <div class="flex justify-center mt-6">
        <button class="btn btn-ghost btn-sm" @click.stop="reloadAnimation">
          再表示 (右クリックで消失アニメーション)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { CharacterColorType, EnterMotionType } from '@/types/OmikujiData/'
  import { FontFamilyType, useFontFamily } from '@/types'
  import CommentBubbleItem from '@main/ui/CommentBubble/parts/CommentBubbleItem.vue'
  import MotionWrapper from '@main/ui/CommentBubble/MotionVariants/MotionWrapper.vue'

  const props = withDefaults(
    defineProps<{
      botName?: string
      color: CharacterColorType
      customClasses?: string
      fontFamily?: FontFamilyType
      bubbleMotionEnter?: EnterMotionType
      animatedText?: boolean
      animatedTextSpeed?: number
    }>(),
    {
      botName: 'テストユーザー',
      fontFamily: 'default',
      bubbleMotionEnter: 'slideUp',
      animatedText: false,
      animatedTextSpeed: 50,
    }
  )

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

  // アニメーションのリロード関数
  const reloadAnimation = async () => {
    // メッセージを切り替え
    switchPreview()

    // MotionWrapperのreload関数を呼び出すだけ
    await motionWrapper.value?.reload()
  }

  // 右クリックでアニメーションを非表示にする関数
  const hideAnimation = () => {
    // MotionWrapperのhide関数を呼び出すだけ
    motionWrapper.value?.hide()
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
