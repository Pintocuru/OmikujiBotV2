<!-- src/MainGenerator/components/CharacterAvatar.vue -->
<template>
  <div
    v-if="profileImage && profileImage !== ''"
    class="avatar"
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
        backgroundColor: backgroundColor,
      }),
    }"
  >
    <img :src="getImagePath(profileImage)" @error="handleImageError" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { SIZE_CONFIG } from './composables/SizeConfig'
  import { getImagePath } from '@/types/env'
  import type { DisplaySize } from '@shared/types'

  const props = withDefaults(
    defineProps<{
      profileImage?: string | null
      characterName?: string
      backgroundColor?: string
      showCharacterFrame?: boolean
      isVisible?: boolean
      displaySize?: DisplaySize
    }>(),
    {
      profileImage: null,
      characterName: 'おみくじBOT',
      backgroundColor: '#ccc',
      showCharacterFrame: true,
      isVisible: true,
      displaySize: 'md',
    }
  )

  // サイズ設定
  const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize])

  // 画像読み込みエラーハンドラー
  const handleImageError = () => {
    console.error(`キャラクター画像が読み込めません: ${props.characterName}`, {
      characterName: props.characterName,
      imagePath: props.profileImage,
    })
  }
</script>
