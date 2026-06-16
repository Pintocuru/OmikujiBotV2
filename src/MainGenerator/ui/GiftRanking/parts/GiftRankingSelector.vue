<!-- src/MainGenerator/ui/GiftRanking/parts/GiftRankingSelector.vue -->
<template>
  <div v-if="hasMessage" class="bg-base-100 transparent-bg overflow-hidden" :data-theme="settings.color">
    <component
      :is="currentComponent"
      :messages="messages"
      :displayOptions="settings.displayOptions"
      :iconSize="settings.iconSize"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { GiftComponent, GiftRankingType } from '@/types'
  import grid from '../layouts/grid.vue'
  import standard from '../layouts/standard.vue'
  import list from '../layouts/list.vue'
  import table from '../layouts/table.vue'
  import scroll from '../layouts/scroll.vue'
  import podium from '../layouts/podium.vue'
  import { OmikenCommentType } from '@shared/types'

  const props = defineProps<{
    settings: GiftRankingType
    messages: OmikenCommentType[]
  }>()

  const componentMap: Record<GiftComponent, Component> = {
    grid,
    standard,
    list,
    table,
    scroll,
    podium,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] ?? grid)
  const hasMessage = computed(() => props.messages.length > 0)
</script>
