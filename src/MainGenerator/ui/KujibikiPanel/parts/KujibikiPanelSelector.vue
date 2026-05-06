<!-- src/MainGenerator/ui/KujibikiPanel/parts/KujibikiPanelSelector.vue -->
<template>
  <MotionWrapper v-if="hasMessage" :key="currentKey" :visible="true" :motion="settings.animation" class="w-full">
    <component :is="currentComponent" :messages="messages" :label="settings.label" />
  </MotionWrapper>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { BotMessageBubbleType, KujibikiComponent, KujibikiPanelType } from '@/types'
  import MotionWrapper from '@main/ui/CommentBubble/MotionVariants/MotionWrapper.vue'
  import omikuji from '../layouts/omikuji.vue'
  import flower from '../layouts/flower.vue'
  import tarot from '../layouts/tarot.vue'

  const props = defineProps<{
    settings: KujibikiPanelType
    messages: BotMessageBubbleType[]
  }>()

  const componentMap: Record<KujibikiComponent, Component> = {
    omikuji,
    flower,
    tarot,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] ?? omikuji)

  const hasMessage = computed(() => props.messages.some((m) => !!m.bubble?.message))

  // メッセージIDが変わるたびに MotionWrapper を再マウントしてアニメーションを再生
  const currentKey = computed(() => props.messages[0]?.id ?? '')
</script>
