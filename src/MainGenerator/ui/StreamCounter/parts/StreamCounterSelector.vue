<!-- src/MainGenerator/ui/StreamCounter/parts/StreamCounterSelector.vue -->
<template>
  <div class="w-full bg-base-100 transparent-bg" :data-theme="settings.color">
    <div v-if="allKeys.length === 0" class="flex flex-col items-center">
      <div class="badge badge-error font-bold">表示するカウンターはありません</div>
    </div>

    <!-- layoutに応じて動的にクラスを変更 -->
    <div v-else :class="layoutClass">
      <div v-for="(key, index) in allKeys" :key="key">
        <component
          :is="currentItem"
          :index="index"
          :label="getLabel(key)"
          :value="formatValue(counters[key] ?? 0)"
          :color-pattern="getPattern(key)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, toRef, type Component } from 'vue'
  import { type StreamCounterType, type LiverComponent, streamComponentMap } from '@/types/'

  import BasicCirclePlain from '../layouts/BasicCirclePlain.vue'
  import BasicCircle from '../layouts/BasicCircle.vue'
  import PixelBadgePlain from '../layouts/PixelBadgePlain.vue'
  import PixelBadge from '../layouts/PixelBadge.vue'
  import MagicalStone from '../layouts/MagicalStone.vue'
  import StarBurst from '../layouts/StarBurst.vue'
  import HexGrid from '../layouts/HexGrid.vue'
  import Badge from '../layouts/Badge.vue'

  import { useStreamCounterDisplay } from '../composables/useStreamCounterDisplay'
  import { useLabelResolver } from '../composables/useLiverLabelResolver'

  const props = defineProps<{
    settings: StreamCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
    variableLabels: Record<string, string>
  }>()

  // variableLabels を優先してマージ
  const { getLabel: getEventLabel } = useLabelResolver(toRef(props, 'eventLabels'), toRef(props.settings, 'labelStyle'))
  const { getLabel: getVariableLabel } = useLabelResolver(
    toRef(props, 'variableLabels'),
    toRef(props.settings, 'labelStyle')
  )
  const getLabel = (key: string): string | Component => {
    const variable = getVariableLabel(key)
    if (variable !== key) return variable // key がそのまま返ってきた = 未ヒット
    console.log(getEventLabel(key))
    return getEventLabel(key)
  }

  const { allKeys, getPattern, formatValue } = useStreamCounterDisplay(toRef(props, 'settings'))

  const itemMap: Record<LiverComponent, Component> = {
    basicCirclePlain: BasicCirclePlain,
    basicCircle: BasicCircle,
    pixelBadge: PixelBadge,
    pixelBadgePlain: PixelBadgePlain,
    magicalStone: MagicalStone,
    starBurst: StarBurst,
    hexGrid: HexGrid,
    badge: Badge,
  }

  const currentItem = computed(() => itemMap[props.settings.component] ?? BasicCircle)

  // 現在のコンポーネントのレイアウト設定を取得
  const currentLayout = computed(() => {
    const component = streamComponentMap[props.settings.component]
    return component?.layout ?? 'horizontal' // デフォルトは横並び
  })

  // layoutに応じて動的にクラスを変更
  const layoutClass = computed(() => {
    switch (currentLayout.value) {
      case 'vertical':
        return 'flex flex-col items-center gap-2'
      case 'horizontal':
      default:
        return 'flex flex-wrap justify-center gap-4 py-2'
    }
  })
</script>
