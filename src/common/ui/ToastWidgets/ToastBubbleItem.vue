<!-- src/MainGenerator/components/ToastBubbleItem.vue -->
<template>
  <div :class="showToastsOnRight ? 'chat chat-end' : 'chat chat-start'">
    <!-- アイコン -->
    <div v-if="iconLayers?.length" class="chat-image avatar relative w-10 h-10">
      <CharacterLayerImage :layers="iconLayers" :size="10" :color="color" />
    </div>

    <!-- メッセージ -->
    <div
      class="chat-bubble max-w-xs"
      :data-theme="color.isTheme ? color.daisyUiTheme : null"
      :class="
        color.isTheme
          ? ['bg-gradient-to-br', `from-${color.backFrom}`, `to-${color.backTo}`, 'text-primary-content']
          : ''
      "
      :style="!color.isTheme ? { backgroundColor: color.backgroundColor } : {}"
    >
      <div class="leading-tight text-base" :style="!color.isTheme ? { color: color.textColor } : {}">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CharacterColorType } from '@/types/OmikujiData/'
  import CharacterLayerImage from '@/common/LayerImage/CharacterLayerImage.vue'

  const props = defineProps<{
    message: string
    color: CharacterColorType
    iconLayers?: string[]
    showToastsOnRight: boolean
  }>()
</script>
