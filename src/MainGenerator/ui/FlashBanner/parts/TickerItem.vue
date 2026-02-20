<!-- src/MainGenerator/ui/FlashBanner/parts/TickerItem.vue -->
<template>
  <div
    class="flex items-center overflow-hidden px-2"
    :class="[settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row']"
  >
    <!-- ラベルブロック：強調カラー帯 -->
    <div
      v-if="settings.label"
      class="badge items-center justify-center font-bold"
      :class="[labelClass]"
      :style="uiMap.name.style"
    >
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="flex items-center px-2 shrink-0">
      <LayerImage :layers="layers" :size="settings.iconSize" />
    </div>

    <!-- テキスト：常時スクロール -->
    <div
      class="flex-1 overflow-hidden flex items-center p-1 ticker-fade-mask"
      :class="uiMap.bubble.class"
      :style="uiMap.bubble.style"
    >
      <div class="flex items-center animate-ticker" :style="tickerStyle">
        <!-- テキストを repeat 回繰り返してシームレスに流す -->
        <span
          v-for="i in repeat"
          :key="i"
          class="inline-block whitespace-nowrap font-bold text-2xl"
          :class="uiMap.text.class"
          :style="spanStyle(i)"
          v-html="message"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { CharacterColorType, SettingsFlashBannerType } from '@/types/OmikujiData/'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { createUiMap } from '@main/ui/CommentBubble/composables/UiBubbleMap'

  // Props
  const props = defineProps<{
    settings: SettingsFlashBannerType
    message: string
    layers: string[]
    color: CharacterColorType
    labelClass?: string
  }>()

  // テキスト間の空白 (px)
  // 短いテキストでも密になりすぎないよう、文字数に応じて調整
  const GAP_PX = computed(() => {
    const len = props.message.replace(/<[^>]*>/g, '').length
    if (len < 20) return 120
    if (len < 50) return 80
    return 60
  })

  // テキストを何回繰り返すか
  // 短いテキストは多めに繰り返して、コンテナ幅に対して常に画面を埋める
  // （最低4回＝左右フェードで隠れる分も含めて余裕を持たせる）
  const repeat = computed(() => {
    const len = props.message.replace(/<[^>]*>/g, '').length
    if (len < 15) return 8
    if (len < 40) return 6
    return 4
  })

  const uiMap = computed(() => createUiMap({ color: props.color }))
  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.layers.length > 0)

  // 1文字あたりの移動時間（秒）
  const duration = computed(() => {
    const len = props.message.replace(/<[^>]*>/g, '').length
    const perChar = 1
    return len * perChar
  })

  // アニメーション：repeat 個並んだうちの 1セグメント分（1/repeat）だけ左にずらす
  const tickerStyle = computed(() => ({
    willChange: 'transform',
    '--ticker-shift': `calc(-100% / ${repeat.value})`,
    '--ticker-duration': `${duration.value}s`, // ← 追加
  }))

  const glowStyle = computed(() => ({
    textShadow: `0 0 8px currentColor, 0 0 2px currentColor`,
  }))

  // 各スパンのスタイル（最初以外は左paddingでGAPを設ける）
  const spanStyle = (i: number) => ({
    ...uiMap.value.text.style,
    ...glowStyle.value,
    ...(i > 1 ? { paddingLeft: `${GAP_PX.value}px` } : {}),
  })
</script>

<style scoped>
  /*
    repeat 個並べた全体を 1/repeat だけ左にずらすとシームレスにループする。
    CSS変数 --ticker-shift を使うことで、repeat 数が変わっても対応できる。
  */
  .animate-ticker {
    animation: ticker-loop var(--ticker-duration) linear infinite;
  }

  @keyframes ticker-loop {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(var(--ticker-shift));
    }
  }

  /*
    左右端をフェードアウトさせてワープの瞬間を隠す。
    mask-image で両端 6% をフェード。
  */
  .ticker-fade-mask {
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
  }

  .blink-animation {
    animation: blink 0.25s ease-in-out 3;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
  }
</style>
