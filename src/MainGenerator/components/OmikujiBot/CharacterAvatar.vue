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

  // サイズ設定の定数
  const SIZE_CONFIG = {
    xs: { text: 'text-md', avatar: 'w-32 h-32', avatarTop: '160px', spacing: 20 },
    sm: { text: 'text-lg', avatar: 'w-48 h-48', avatarTop: '200px', spacing: 40 },
    md: { text: 'text-xl', avatar: 'w-64 h-64', avatarTop: '240px', spacing: 60 },
    lg: { text: 'text-2xl', avatar: 'w-80 h-80', avatarTop: '280px', spacing: 80 },
    xl: { text: 'text-3xl', avatar: 'w-96 h-96', avatarTop: '320px', spacing: 100 },
  } as const

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
