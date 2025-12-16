<!-- src/ConfigMaker/components/parts/CommentBubblePreview.vue -->
<template>
  <div class="space-y-4">
    <!-- 横幅調整スライダー -->
    <div v-if="isSlider" class="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
      <label class="text-sm font-medium min-w-0 flex-shrink-0">横幅:</label>
      <input type="range" :min="minWidth" :max="maxWidth" v-model="currentWidth" class="range range-primary flex-1" />
      <span class="text-sm font-mono min-w-0 flex-shrink-0">{{ currentWidth }}px</span>
    </div>

    <!-- プレビュー表示エリア（横幅制限付き） -->
    <div
      class="cursor-pointer border-2 border-dashed border-base-300 rounded-lg p-4"
      :class="fontClass"
      :style="{ width: currentWidth + 'px' }"
      @click="reloadAnimation"
      @contextmenu.prevent="hideAnimation"
    >
      <!-- MotionWrapperを使用してシンプルに -->
      <MotionWrapper
        ref="motionWrapper"
        v-model:visible="shouldShowBubble"
        :initialMotion="bubbleMotionEnter"
        :enter-motion="bubbleMotionEnter"
        :leave-motion="bubbleMotionLeave"
        :auto-hide="false"
      >
        <CommentBubbleItem
          botName="テストユーザー"
          :message="currentPreview"
          :color="color"
          :custom-classes="customClasses"
          :animatedText="animatedText"
          :animatedTextSpeed="animatedTextSpeed"
        />
      </MotionWrapper>

      <div class="flex justify-center mt-6">
        <button class="btn btn-ghost btn-sm" @click.stop="reloadAnimation">
          再表示 (右クリックで消失アニメーション)
        </button>
      </div>
    </div>

    <!-- 幅プリセットボタン -->
    <div v-if="isSlider" class="flex gap-2 justify-center flex-wrap">
      <button
        v-for="preset in widthPresets"
        :key="preset.name"
        class="btn btn-xs"
        :class="{ 'btn-primary': currentWidth === preset.value, 'btn-outline': currentWidth !== preset.value }"
        @click="currentWidth = preset.value"
      >
        {{ preset.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { FontFamilyType, useFontFamily } from '@/types/BotComponents/useFontFamily'
  import { MotionType } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
  import CommentBubbleItem from '@MainComponents/CommentBubble/CommentBubbleItem.vue'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'

  // Props定義（元のコンポーネントと同じ）
  const props = withDefaults(
    defineProps<{
      color: CharacterColorType
      customClasses?: string | undefined
      isSlider?: boolean
      fontFamily?: FontFamilyType
      bubbleMotionEnter?: MotionType
      bubbleMotionLeave?: MotionType
      animatedText?: boolean
      animatedTextSpeed?: number
    }>(),
    {
      fontFamily: 'default',
      isSlider: false,
      bubbleMotionEnter: 'slideUp',
      bubbleMotionLeave: 'slideUp',
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

  // 横幅設定（TailwindCSSのmax-w-*を参考）
  const minWidth = 160 // max-w-28 (112px) 相当
  const maxWidth = 576 // max-w-xl (576px) 相当
  const currentWidth = ref(320) // デフォルトは max-w-sm (320px) 相当

  // 横幅プリセット（TailwindCSSの値を参考）
  const widthPresets = [
    { name: 'XS', value: 160 }, // max-w-xs 相当
    { name: 'SM', value: 256 }, // max-w-sm 相当
    { name: 'MD', value: 320 }, // max-w-md 相当
    { name: 'LG', value: 384 }, // max-w-lg 相当
    { name: 'XL', value: 448 }, // max-w-xl 相当
    { name: '最大', value: maxWidth },
  ]

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
  @import url('../../../../assets/styles/font.css');
</style>
