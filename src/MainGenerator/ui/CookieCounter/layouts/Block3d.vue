<!-- src/MainGenerator/ui/CookieCounter/layouts/BlockPanel.vue -->
<template>
  <div class="flex justify-center items-center min-h-screen">
    <div v-if="slots.length === 0" class="text-base-content/40 text-2xl">まだ何も表示されません…</div>

    <div v-else class="relative">
      <!-- ===== メインカウンター ===== -->
      <div v-if="slots[0]" class="relative">
        <!-- 押し出し影レイヤー（右下方向に積層） -->
        <div
          v-for="i in DEPTH"
          :key="i"
          class="absolute rounded-sm"
          :class="`border-[10px] border-${color.backTo}`"
          :style="{
            inset: 0,
            transform: `translate(${i * 3}px, ${i * 2}px)`,
            opacity: 0.4 + i * 0.06,
            zIndex: i,
          }"
        />

        <!-- 正面パネル -->
        <div
          class="relative rounded-sm"
          :class="`bg-${color.backFrom} border-[10px]`"
          :style="{ zIndex: DEPTH + 1, borderColor: highlightColor }"
        >
          <!-- 左上ハイライト辺（上・左だけ明るい） -->
          <div
            class="absolute inset-0 rounded-sm pointer-events-none"
            :style="{
              boxShadow: `inset 3px 3px 0 0 ${highlightColor}, inset -3px -3px 0 0 ${shadowColor}`,
            }"
          />

          <!-- 数値 -->
          <div class="flex flex-col items-center justify-center px-4 py-0 gap-1">
            <span
              class="counter-value text-9xl leading-none"
              :class="`text-${color.backFrom}-content`"
              :style="{
                transform: `skewX(-6deg) scale(${mainScale})`,
                transformOrigin: 'center',
              }"
              >{{ formatValue(displayMain) }}
            </span>
          </div>
        </div>
      </div>

      <!-- ===== サブカウンター（右下） ===== -->
      <div
        v-if="slots[1]"
        class="absolute"
        style="bottom: -16px; right: -24px; transform: translate(50%, 50%); z-index: 100"
      >
        <!-- 押し出し影レイヤー -->
        <div
          v-for="i in SUB_DEPTH"
          :key="i"
          class="absolute rounded-sm"
          :class="`border-[10px] border-${color.backFrom}`"
          :style="{
            inset: 0,
            transform: `translate(${i * 3}px, ${i * 2}px)`,
            opacity: 0.4 + i * 0.08,
            zIndex: i,
          }"
        />

        <!-- 正面パネル -->
        <div
          class="relative rounded-sm"
          :class="`bg-${color.backTo} border-[10px]`"
          :style="{ zIndex: SUB_DEPTH + 1, borderColor: subHighlightColor }"
        >
          <div
            class="absolute inset-0 rounded-sm pointer-events-none"
            :style="{
              boxShadow: `inset 3px 3px 0 0 ${subHighlightColor}, inset -3px -3px 0 0 ${subShadowColor}`,
            }"
          />

          <div class="flex flex-col items-center justify-center px-4 py-1 gap-1">
            <span
              class="counter-value text-7xl leading-none"
              :class="`text-${color.backTo}-content`"
              :style="{
                transform: `skewX(-6deg) scale(${subScale})`,
                transformOrigin: 'center',
              }"
              >{{ formatValue(displaySub) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useTransition, TransitionPresets } from '@vueuse/core'
  import type { CookieCounterType } from '@/types/'
  import { useCookieLabelResolver } from '../composables/useCookieLabelResolver'

  const props = defineProps<{
    counters: Record<string, number>
    counterDefs: CookieCounterType['counters']
    eventLabels: Record<string, string>
    variableLabels: Record<string, string>
    color: CookieCounterType['color']
  }>()

  // ────────────────────────────────────────────
  // 定数
  // ────────────────────────────────────────────
  const DEPTH = 48
  const SUB_DEPTH = 15

  // ────────────────────────────────────────────
  // ラベル解決・スロット
  // ────────────────────────────────────────────
  const { getLabel } = useCookieLabelResolver(props.eventLabels, props.variableLabels)
  const formatValue = (v: number) => new Intl.NumberFormat('ja-JP').format(Math.round(v))

  const slots = computed(() =>
    props.counterDefs.slice(0, 2).map((def) => ({
      label: getLabel(def.type, def.target, def.type !== 'variable' ? undefined : def.label),
      value: props.counters[def.target] ?? 0,
    }))
  )

  // ────────────────────────────────────────────
  // 枠線ハイライト・シャドウカラー（CSS変数から取得）
  // DaisyUI の oklch 変数を直接参照できないため
  // white/black の半透明で光源・影を演出
  // ────────────────────────────────────────────
  const highlightColor = 'rgba(255,255,255,0.45)'
  const shadowColor = 'rgba(0,0,0,0.45)'
  const subHighlightColor = 'rgba(255,255,255,0.40)'
  const subShadowColor = 'rgba(0,0,0,0.40)'

  // ────────────────────────────────────────────
  // カウントアップトランジション
  // ────────────────────────────────────────────
  const mainSource = computed(() => slots.value[0]?.value ?? 0)
  const subSource = computed(() => slots.value[1]?.value ?? 0)

  const displayMain = useTransition(mainSource, { duration: 600, transition: TransitionPresets.easeOutCubic })
  const displaySub = useTransition(subSource, { duration: 600, transition: TransitionPresets.easeOutCubic })

  // ────────────────────────────────────────────
  // バウンスアニメーション
  // ────────────────────────────────────────────
  const BOUNCE_FRAMES = [1.0, 0.5, 1.3, 0.8, 1.1, 0.9, 1.0]
  const FRAME_MS = 80

  function useBounceScale() {
    const scale = ref(1)
    let timer: ReturnType<typeof setTimeout> | null = null

    const trigger = () => {
      if (timer) return
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
