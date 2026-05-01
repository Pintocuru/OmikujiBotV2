<!-- src/common/LayerImage/CharacterLayerImage.vue -->
<template>
  <div
    class="rounded-full overflow-hidden"
    :data-theme="themeAttr"
    :class="color.isTheme ? ['bg-gradient-to-br', `from-${color.backFrom}`, `to-${color.backTo}`] : []"
    :style="backgroundStyle"
  >
    <LayerImage :layers="layers" :size="size" :animation="animation" round />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterAnimationType, CharacterColorType } from '@/types'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  const props = defineProps<{
    layers: string[] | string
    size?: number
    color: CharacterColorType
    animation?: CharacterAnimationType
  }>()

  const themeAttr = computed(() => (props.color.isTheme ? props.color.daisyUiTheme : null))
  const backgroundStyle = computed(() =>
    !themeAttr.value ? { backgroundColor: props.color.backgroundColor } : undefined
  )
</script>
