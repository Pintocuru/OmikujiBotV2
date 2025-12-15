<!-- src\MainGenerator\components\CommentBubble\CharacterAvatar.vue -->
<template>
  <div
    v-if="hasProfileImage"
    class="avatar"
    :class="[
      'w-48',
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
    <LayerImage :layers="normalizedImages" :size="48" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import LayerImage from '@/common/LayerImage.vue'
  import { CharacterEmotionType } from '@/types'

  const props = withDefaults(
    defineProps<{
      profileImage?: string[] | string | null
      characterKey?: string | null
      iconKey?: CharacterEmotionType
      characterName?: string
      backgroundColor?: string
      showCharacterFrame?: boolean
      isVisible?: boolean
    }>(),
    {
      profileImage: null,
      characterKey: null,
      characterName: 'おみくじBOT',
      iconKey: 'default',
      backgroundColor: '#ccc',
      showCharacterFrame: true,
      isVisible: true,
    }
  )

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
