<!-- src/MainGenerator/ui/GiftRanking/parts/GiftRankingSelector.vue -->
<template>
  <div v-if="hasMessage" :data-theme="settings.color" class="w-full">
    <component :is="currentComponent" :messages="messages" :settings="settings" />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { GiftComponent, GiftRankingType } from '@/types'
  import grid from '../layouts/grid.vue'
  import { OmikenCommentType } from '@shared/types'

  const props = defineProps<{
    settings: GiftRankingType
    messages: OmikenCommentType[]
  }>()

  const componentMap: Record<GiftComponent, Component> = {
    grid,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] ?? grid)

  const hasMessage = computed(() => props.messages.length > 0)
</script>
