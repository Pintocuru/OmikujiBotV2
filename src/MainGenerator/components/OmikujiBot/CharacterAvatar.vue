<!-- src/MainGenerator/components/CharacterAvatar.vue -->
<template>
  <div
    v-if="profileImage && profileImage !== ''"
    :class="[
      sizeConfig.avatar,
      {
        'rounded-full': showCharacterFrame,
        'overflow-hidden': showCharacterFrame,
      },
    ]"
    :style="{
      opacity: isVisible ? '100%' : '0%',
      ...(showCharacterFrame && {
        backgroundColor: backgroundColor || '#ccc',
      }),
    }"
  >
    <img
      :src="getImagePath(profileImage)"
      :alt="`${characterName}のアバター`"
      @error="$emit('imageError')"
      class="w-full h-full object-cover"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { getImagePath } from '@/types/env'
  import type { DisplaySize } from '@shared/types'
  import { SIZE_CONFIG } from './composables/SizeConfig'

  interface Props {
    profileImage: string | null
    characterName?: string
    backgroundColor?: string
    showCharacterFrame: boolean
    isVisible: boolean
    displaySize: DisplaySize
  }

  const props = defineProps<Props>()

  defineEmits<{
    imageError: []
  }>()

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize])
</script>
