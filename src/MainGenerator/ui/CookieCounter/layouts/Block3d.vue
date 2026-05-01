<!-- src/MainGenerator/ui/CookieCounter/layouts/Block3d.vue -->
<template>
  <div class="flex justify-center items-center">
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

        <!-- 正面パネル（押し込みで translate する） -->
        <div
          class="relative rounded-sm"
          :class="`bg-${color.backFrom} border-[10px]`"
          :style="{
            zIndex: DEPTH + 1,
            borderColor: highlightColor,
            transform: `translate(${mainPush.x}px, ${mainPush.y}px)`,
            transition: mainPush.transitioning ? 'none' : 'transform 0.12s ease-out',
          }"
        >
          <!-- ベベル: 左上ハイライト / 右下シャドウ -->
          <div
            class="absolute inset-0 rounded-sm pointer-events-none"
            :style="{
              boxShadow: `inset 3px 3px 0 0 ${highlightColor}, inset -3px -3px 0 0 ${shadowColor}`,
            }"
          />

          <!-- 数値 -->
          <div class="flex items-center justify-center px-4 py-0 gap-1" style="min-width: 260px; min-height: 180px">
            <span
              class="counter-value text-9xl leading-none"
              :class="`text-${color.backFrom}-content`"
              :style="{ transform: `skewX(-6deg)` }"
              >{{ formatValue(displayMain) }}</span
            >
          </div>

          <!-- ラベル: 左下に絶対配置 -->
          <span class="counter-label absolute bottom-2 left-3" :class="`text-${color.backFrom}-content`">{{
            slots[0].label
          }}</span>
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
          :style="{
            zIndex: SUB_DEPTH + 1,
            borderColor: subHighlightColor,
            transform: `translate(${subPush.x}px, ${subPush.y}px)`,
            transition: subPush.transitioning ? 'none' : 'transform 0.12s ease-out',
          }"
        >
          <div
            class="absolute inset-0 rounded-sm pointer-events-none"
            :style="{
              boxShadow: `inset 3px 3px 0 0 ${subHighlightColor}, inset -3px -3px 0 0 ${subShadowColor}`,
            }"
          />

          <div class="flex items-center justify-center px-4 py-1 gap-1" style="min-width: 140px; min-height: 110px">
            <span
              class="counter-value text-7xl leading-none"
              :class="`text-${color.backTo}-content`"
              :style="{ transform: `skewX(-6deg)` }"
              >{{ formatValue(displaySub) }}</span
            >
          </div>

          <!-- ラベル: 左下に絶対配置 -->
          <span class="counter-label absolute bottom-1.5 left-3" :class="`text-${color.backTo}-content`">{{
            slots[1].label
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, watch } from 'vue'
  import { useTransition, TransitionPresets } from '@vueuse/core'
  import type { CookieCounterType } from '@/types'
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
  const DEPTH = 16
  const SUB_DEPTH = 15

  // 押し込み量 = 影の最大オフセット量と同じにする（影にぴったり重なる）
  const MAIN_PUSH_X = DEPTH * 3
  const MAIN_PUSH_Y = DEPTH * 2
  const SUB_PUSH_X = SUB_DEPTH * 3
  const SUB_PUSH_Y = SUB_DEPTH * 2

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
  // ベベルカラー
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
  // 押し込みアニメーション
  //
  // 仕組み：
  //   1. CSS transition を OFF にして正面パネルを
  //      影の最大オフセット位置（影と重なる位置）へ瞬間移動
  //   2. 1フレーム後に transition を ON にして (0,0) へ ease-out で戻す
  //
  // → 「ガコッ」と押し込まれて、ゆっくり浮き上がるような動き
  // ────────────────────────────────────────────
  function usePushAnimation(maxX: number, maxY: number) {
    const push = reactive({ x: 0, y: 0, transitioning: false })
    let timer: ReturnType<typeof setTimeout> | null = null

    const trigger = () => {
      if (timer) return
      push.transitioning = true
      push.x = maxX
      push.y = maxY
      timer = setTimeout(() => {
        push.transitioning = false
        push.x = 0
        push.y = 0
        timer = null
      }, 16)
    }

    return { push, trigger }
  }

  const { push: mainPush, trigger: triggerMain } = usePushAnimation(MAIN_PUSH_X, MAIN_PUSH_Y)
  const { push: subPush, trigger: triggerSub } = usePushAnimation(SUB_PUSH_X, SUB_PUSH_Y)

  watch(mainSource, (n, o) => {
    if (n !== o) triggerMain()
  })
  watch(subSource, (n, o) => {
    if (n !== o) triggerSub()
  })
</script>

<style scoped>
  .counter-value {
    font-weight: 900;
    display: inline-block;
    -webkit-text-stroke: 0.03em rgba(0, 0, 0, 0.35);
    paint-order: stroke fill;
    letter-spacing: -4px;
  }

  .counter-label {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    opacity: 0.7;
  }
</style>
