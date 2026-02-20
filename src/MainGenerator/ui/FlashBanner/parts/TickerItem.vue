<!-- src/MainGenerator/ui/FlashBanner/parts/TickerItem.vue -->
<template>
  <div
    v-if="message"
    class="flex items-stretch w-full min-h-10 overflow-hidden shadow-lg"
    :data-theme="dataTheme"
    :style="uiMap.bubble.style"
  >
    <!-- ラベルブロック：強調カラー帯 -->
    <div
      class="flex items-center justify-center px-4 font-black text-sm tracking-widest shrink-0 uppercase"
      :class="[labelClass, uiMap.name.class]"
      :style="uiMap.name.style"
    >
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="flex items-center px-2 shrink-0">
      <LayerImage :layers="layers" :size="settings.iconSize" />
    </div>

    <!-- テキスト：常時スクロール -->
    <!-- fade-mask で左右端をフェードアウトさせてワープを誤魔化す -->
    <div
      class="flex-1 overflow-hidden flex items-center ticker-fade-mask"
      :class="uiMap.bubble.class"
      :style="uiMap.bubble.style"
    >
      <div class="flex items-center animate-ticker" :style="tickerStyle">
        <!-- テキストを repeat 回繰り返してシームレスに流す -->
        <span
          v-for="i in repeat"
          :key="i"
          class="inline-block whitespace-nowrap font-bold text-base"
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

  const dataTheme = computed(() => props.color?.daisyUiTheme ?? 'light')
  const uiMap = computed(() => createUiMap({ color: props.color }))
  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.layers.length > 0)

  // 1セグメントあたりの文字数で速度を決める
  // 短いテキスト → 遅め（ループが目立ちにくい）
  // 長いテキスト → やや速め（情報が流れすぎない）
  const duration = computed(() => {
    const len = props.message.replace(/<[^>]*>/g, '').length
    if (len < 15) return 38 // 遅め
    if (len < 40) return 32
    return 28
  })

  // アニメーション：repeat 個並んだうちの 1セグメント分（1/repeat）だけ左にずらす
  // こうすることで「何文字でも1セグメント分がループ単位」になり、
  // -50% 固定による位置ズレを回避できる

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
