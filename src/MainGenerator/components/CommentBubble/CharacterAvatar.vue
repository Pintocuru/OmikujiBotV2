<!-- src\MainGenerator\components\CommentBubble\CharacterAvatar.vue -->
<template>
  <div
    v-if="hasProfileImage"
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
    <img
      v-for="(img, index) in normalizedImages"
      :key="index"
      :src="getImagePath(img)"
      @error="handleImageError"
      class="absolute top-0 left-0 w-full h-full object-cover"
      :style="{ zIndex: index }"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { SIZE_CONFIG } from './composables/SizeConfig'
  import { getImagePath } from '@/types/env'
  import { DisplaySize } from '@shared/types'

  const props = withDefaults(
    defineProps<{
      profileImage?: string[] | string | null
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

  // 単一 or 配列を統一的に扱う
  const normalizedImages = computed(() =>
    Array.isArray(props.profileImage) ? props.profileImage : props.profileImage ? [props.profileImage] : []
  )

  const hasProfileImage = computed(() => normalizedImages.value.length > 0)

  // エラーハンドラー
  const handleImageError = () => {
    console.error(`キャラクター画像が読み込めません: ${props.characterName}`, {
      characterName: props.characterName,
      imagePath: props.profileImage,
    })
  }
</script>
