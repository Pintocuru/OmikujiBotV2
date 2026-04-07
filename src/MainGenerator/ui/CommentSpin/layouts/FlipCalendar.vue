<!-- src/MainGenerator/ui/CommentSpin/layouts/FlipCalendar.vue -->
<template>
  <div
    class="relative rounded-xl shadow-lg border-4 overflow-hidden bg-base-200 flex items-center justify-center"
    :class="[`border-${color.backFrom}`]"
    :style="{
      width: `${size.width}px`,
      height: `${size.height}px`,
    }"
  >
    <!-- スピン中: フリップアニメーション -->
    <template v-if="isSpinning && currentImage">
      <div class="flip-scene" :style="sceneStyle">
        <!-- カレンダー: 上半分が落ちる -->
        <template v-if="animation === 'calendar'">
          <!-- 下半分（次の画像・常に見えている） -->
          <div class="card card-bottom" :style="cardHalfStyle">
            <img :src="currentImage" :style="imgStyle" class="card-img card-img-bottom" />
          </div>
          <!-- 上半分（現在の画像・落ちていく） -->
          <div class="card card-top" :class="{ 'card-top-flip': isFlipping }" :style="cardHalfStyle">
            <img :src="prevImage ?? currentImage" :style="imgStyle" class="card-img card-img-top" />
          </div>
        </template>

        <!-- フリップ: コインのように回転 -->
        <template v-else>
          <div class="card card-full" :class="{ 'card-full-flip': isFlipping }" :style="cardFullStyle">
            <div class="card-face card-front">
              <img v-if="prevImage" :src="prevImage" :style="imgStyle" />
            </div>
            <div class="card-face card-back">
              <img v-if="currentImage" :src="currentImage" :style="imgStyle" />
            </div>
          </div>
        </template>
      </div>
    </template>

    <!-- 確定表示 -->
    <div
      v-else-if="resolvedMessage"
      ref="resolvedRef"
      class="flex items-center justify-center"
      :style="{ width: `${size.width}px`, height: `${size.height}px` }"
    >
      <img v-if="resolvedImage" :src="resolvedImage" :style="imgStyle" />
    </div>

    <!-- フォールバック -->
    <div v-else class="text-7xl opacity-30">?</div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue'
  import type { BotMessageBubbleType, spinAnimation } from '@/types'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    isSpinning: boolean
    slotMessages: BotMessageBubbleType[]
    resolvedMessage: BotMessageBubbleType | null
    size: { width: number; height: number }
    animation: Extract<spinAnimation, 'flip' | 'calendar'>
    characters: Record<string, CharacterType>
  }>()

  const emit = defineEmits<{
    'animation-ready': [el: HTMLElement, itemHeight: number]
    'animation-end': []
  }>()

  const resolvedRef = ref<HTMLElement | null>(null)

  // スピン中の表示インデックス
  const currentIndex = ref(0)
  const isFlipping = ref(false)
  let flipInterval: ReturnType<typeof setInterval> | null = null

  // キャラクター画像URLを取得
  function getImageUrl(msg: BotMessageBubbleType): string | null {
    const charId = msg.bubble?.message
    if (!charId) return null
    return props.characters[charId]?.image ?? null
  }

  const currentImage = computed(() => {
    const msg = props.slotMessages[currentIndex.value]
    return msg ? getImageUrl(msg) : null
  })

  const prevImage = computed(() => {
    const prevIdx = (currentIndex.value - 1 + props.slotMessages.length) % props.slotMessages.length
    const msg = props.slotMessages[prevIdx]
    return msg ? getImageUrl(msg) : null
  })

  const resolvedImage = computed(() => (props.resolvedMessage ? getImageUrl(props.resolvedMessage) : null))

  // スタイル
  const imgSize = computed(() => Math.min(props.size.width, props.size.height) * 0.8)
  const imgStyle = computed(() => ({
    width: `${imgSize.value}px`,
    height: `${imgSize.value}px`,
    objectFit: 'contain' as const,
  }))
  const sceneStyle = computed(() => ({
    width: `${imgSize.value}px`,
    height: `${imgSize.value}px`,
    perspective: '600px',
    position: 'relative' as const,
  }))
  const cardHalfStyle = computed(() => ({
    width: `${imgSize.value}px`,
    height: `${imgSize.value / 2}px`,
    overflow: 'hidden',
    position: 'absolute' as const,
    left: '0',
    transformOrigin: 'bottom center',
    backfaceVisibility: 'hidden' as const,
  }))
  const cardFullStyle = computed(() => ({
    width: `${imgSize.value}px`,
    height: `${imgSize.value}px`,
    position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    transformOrigin: 'center center',
  }))

  // スピン中のコマ送り
  function startFlipLoop() {
    currentIndex.value = 0
    isFlipping.value = false

    flipInterval = setInterval(
      () => {
        isFlipping.value = true
        setTimeout(
          () => {
            currentIndex.value = (currentIndex.value + 1) % props.slotMessages.length
            isFlipping.value = false
          },
          props.animation === 'calendar' ? 200 : 250
        )
      },
      props.animation === 'calendar' ? 400 : 500
    )
  }

  function stopFlipLoop() {
    if (flipInterval) {
      clearInterval(flipInterval)
      flipInterval = null
    }
    isFlipping.value = false
  }

  // isSpinning watch: animation-ready は即時 emit（フリップは自走するため el 不要だが互換性のため emit）
  watch(
    () => props.isSpinning,
    async (val) => {
      if (val) {
        await nextTick()
        startFlipLoop()
        // 親の AnimationController との互換のため dummy emit
        const dummyEl = document.createElement('div')
        emit('animation-ready', dummyEl, props.size.height)
      } else {
        stopFlipLoop()
      }
    }
  )

  // 確定アニメーション
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

<style scoped>
  /* カレンダー: 上半分が手前に落ちる */
  .card-top {
    top: 0;
    transform-origin: bottom center;
    z-index: 2;
  }
  .card-top-flip {
    animation: calendarFlip 0.2s ease-in forwards;
  }
  @keyframes calendarFlip {
    0% {
      transform: rotateX(0deg);
    }
    100% {
      transform: rotateX(-90deg);
    }
  }

  .card-bottom {
    top: 50%;
    z-index: 1;
  }
  .card-img {
    position: absolute;
    left: 0;
    display: block;
  }
  .card-img-top {
    top: 0;
  }
  .card-img-bottom {
    top: -50%;
  } /* 下半分だけ見せる */

  /* フリップ: コイン回転 */
  .card-full {
    transform-style: preserve-3d;
  }
  .card-full-flip {
    animation: coinFlip 0.5s ease-in-out forwards;
  }
  @keyframes coinFlip {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(180deg);
    }
  }

  .card-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card-back {
    transform: rotateY(180deg);
  }
</style>
