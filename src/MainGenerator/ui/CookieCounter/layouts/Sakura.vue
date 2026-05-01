<!-- src/MainGenerator/ui/CookieCounter/layouts/Sakura.vue -->
<template>
  <div class="flex justify-center items-center pt-30">
    <!-- メイン花びら（サブの absolute 基準） -->
    <div v-if="slots[0]" class="relative inline-block">
      <SakuraPetal :src="props.images.main" class="w-110 h-110 animate-spin-slow" />

      <!-- メインの数字・ラベル -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 leading-tight">
        <div class="flex flex-col items-center">
          <span class="counter-label text-6xl truncate">{{ slots[0].label }}</span>
          <span class="counter-value text-[260px] -mt-8" :style="{ transform: `scale(${mainScale})` }">
            {{ formatValue(displayMain) }}
          </span>
        </div>
      </div>

      <!-- サブ花びら -->
      <div v-if="slots[1]" class="absolute top-5 -right-10" style="transform: translate(50%, -50%)">
        <SakuraPetal :src="props.images.sub || props.images.main" class="w-60 h-60 animate-spin-slow-reverse" />

        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 leading-tight">
          <div class="flex flex-col items-center">
            <span class="counter-label text-4xl truncate">{{ slots[1].label }}</span>
            <span class="counter-value text-9xl -mt-3" :style="{ transform: `scale(${subScale})` }">
              {{ formatValue(displaySub) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="slots.length === 0" class="text-pink-400 text-2xl mt-10">まだ何も咲いていません…</div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useTransition, TransitionPresets } from '@vueuse/core'
  import type { CookieCounterType } from '@/types'
  import { useCookieLabelResolver } from '../composables/useCookieLabelResolver'
  import SakuraPetal from './SakuraPetal.vue'

  const props = defineProps<{
    counters: Record<string, number>
    counterDefs: CookieCounterType['counters']
    eventLabels: Record<string, string>
    variableLabels: Record<string, string>
    images: CookieCounterType['images']
  }>()

  const { getLabel } = useCookieLabelResolver(props.eventLabels, props.variableLabels)
  const formatValue = (v: number) => new Intl.NumberFormat('ja-JP').format(Math.round(v))

  const slots = computed(() =>
    props.counterDefs.slice(0, 2).map((def) => ({
      label: getLabel(def.type, def.target, def.type !== 'variable' ? undefined : def.label),
      value: props.counters[def.target] ?? 0,
    }))
  )

  // ────────────────────────────────────────────
  // カウントアップ数値トランジション
  // ────────────────────────────────────────────
  const mainSource = computed(() => slots.value[0]?.value ?? 0)
  const subSource = computed(() => slots.value[1]?.value ?? 0)

  const displayMain = useTransition(mainSource, { duration: 600, transition: TransitionPresets.easeOutCubic })
  const displaySub = useTransition(subSource, { duration: 600, transition: TransitionPresets.easeOutCubic })

  // ────────────────────────────────────────────
  // バウンスアニメーション
  // 100 > 50 > 130 > 80 > 110 > 90 > 100 のスケール列
  // ────────────────────────────────────────────
  const BOUNCE_FRAMES = [1.0, 0.5, 1.3, 0.8, 1.1, 0.9, 1.0]
  const FRAME_MS = 80

  function useBounceScale() {
    const scale = ref(1)
    let timer: ReturnType<typeof setTimeout> | null = null

    const trigger = () => {
      if (timer) return // 連打ガード：前のアニメ中は無視
      let i = 0
      const next = () => {
        scale.value = BOUNCE_FRAMES[i]
        i++
        if (i < BOUNCE_FRAMES.length) {
          timer = setTimeout(next, FRAME_MS)
        } else {
          scale.value = 1
          timer = null
        }
      }
      next()
    }

    return { scale, trigger }
  }

  const { scale: mainScale, trigger: triggerMain } = useBounceScale()
  const { scale: subScale, trigger: triggerSub } = useBounceScale()

  watch(mainSource, (n, o) => {
    if (n !== o) triggerMain()
  })
  watch(subSource, (n, o) => {
    if (n !== o) triggerSub()
  })
</script>

<style scoped>
  /* Google Fonts: Zen Maru Gothic（派手め・丸ゴ・日本語対応） */
  @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@900&display=swap');

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes spin-slow-reverse {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
  .animate-spin-slow {
    animation: spin-slow 60s linear infinite;
  }
  .animate-spin-slow-reverse {
    animation: spin-slow-reverse 80s linear infinite;
  }

  /* 数値・ラベル共通フォント */
  .counter-value,
  .counter-label {
    font-weight: 900;
    display: inline-block; /* scale が効くように */
    transition: transform 0.05s linear;
    /* 縁取り */
    -webkit-text-stroke: 0.05em rgba(21, 21, 21, 0.6);
    paint-order: stroke fill;
  }

  .counter-value {
    font-family: 'Zen Maru Gothic', sans-serif;
    color: white;
    line-height: 1;
  }

  .counter-label {
    color: white;
    -webkit-text-stroke: 0.1em rgba(21, 21, 21, 0.6);
    text-shadow: 0 1px 4px rgba(21, 21, 21, 0.6);
  }
</style>
