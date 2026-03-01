<!-- src/MainGenerator/ui/LiverCounter/parts/BasicCircle.vue -->
<template>
  <div class="flex flex-wrap justify-center gap-4 py-4">
    <BasicCircleItem
      v-for="key in allKeys"
      :key="key"
      :label="getLabel(key)"
      :value="counters[key] ?? 0"
      :color-pattern="getPattern(key)"
    />
  </div>
</template>

<script setup lang="ts">
  import { toRef, type Component } from 'vue'
  import type { LiverDefaultKey, SettingsLiverCounterType } from '@/types/'
  import { ThumbsUp, Eye, Sparkles, MessageCircle, TrendingUp, BadgeDollarSign } from 'lucide-vue-next'
  import BasicCircleItem from './BasicCircleItem.vue'
  import { useLiverCounterDisplay } from '../composables/useLiverCounterDisplay'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  // string のほかに lucide-vue-next の Component も許可
  // 理由: syoken のアイコンが分かりづらいので、よりわかりやすいアイコンに変更できるように
  const DEFAULT_LABELS: Record<LiverDefaultKey, string | Component> = {
    upVote: ThumbsUp,
    viewer: Eye,
    syoken: Sparkles,
    commenter: MessageCircle,
    lc: TrendingUp,
    totalPrice: BadgeDollarSign,
  }

  const getLabel = (key: string): string | Component => {
    // defaultCounters のキーならラベルマップから
    if (key in DEFAULT_LABELS) return DEFAULT_LABELS[key as LiverDefaultKey]
    // eventCounters のキーなら comments から取得した name を使用、なければキーそのまま
    return props.eventLabels[key] ?? key
  }

  const { allKeys, getPattern } = useLiverCounterDisplay(toRef(props, 'settings'))
</script>
