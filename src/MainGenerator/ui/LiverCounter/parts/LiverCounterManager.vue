<!-- src/MainGenerator/ui/FlashBanner/parts/LiverCounterManager.vue -->
<template>
  <div v-if="message" class="w-full bg-base-100" :data-theme="color?.daisyUiTheme">
    <component
      :is="currentComponent"
      :settings="settings"
      :message="message"
      :layers="layers"
      :color="color"
      :label-class="labelClass"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import type { CharacterColorType, LiverComponent, SettingsLiverCounterType } from '@/types/OmikujiData/'
  import BasicCircleItem from './BasicCircleItem.vue'

  const props = withDefaults(
    defineProps<{
      settings: SettingsLiverCounterType
      message: string
      layers: string[]
      color: CharacterColorType
      labelClass?: string
    }>(),
    {
      labelClass: '',
    }
  )

  const componentMap: Record<LiverComponent, Component> = {
    basicCircle: BasicCircleItem,
  }
  const currentComponent = computed(() => componentMap[props.settings.component] ?? BasicCircleItem)
</script>
