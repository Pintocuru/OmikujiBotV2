<!-- src\MainGenerator\components\OmikujiBot\CharacterThumbnailsPreview.vue -->
<template>
  <div class="avatar-group -space-x-6 rtl:space-x-reverse">
    <div
      v-for="(character, index) in characters"
      :key="character.id"
      class="avatar cursor-pointer transition-transform hover:scale-110"
      @click="handleClick(character, false)"
      @contextmenu.prevent="clickable && handleClick(character, true)"
    >
      <div
        :class="[avatarSize, 'rounded-full border border-base-100 shadow-lg']"
        :style="{ backgroundColor: character.color?.backgroundColor }"
      >
        <img
          v-if="getImageSrc(character, index)"
          :src="getImageSrc(character, index)"
          :alt="`${character.displayName || character.name}のアイコン`"
          class="object-cover"
          :class="imageClass"
        />
        <span v-else class="w-full h-full flex items-center justify-center text-white font-bold">
          {{ (character.displayName || character.name)?.charAt(0) || '?' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import { getImagePath } from '@/types/env'
  import { DisplaySize } from '@shared/types/CommonSchema'

  const props = withDefaults(
    defineProps<{
      characters: CharacterType[]
      displaySize?: DisplaySize
      clickable?: boolean
      imageClass?: string
      getImageSrc?: (character: CharacterType, index: number) => string | undefined
    }>(),
    {
      displaySize: 'md',
      clickable: false,
      imageClass: '',
      getImageSrc: (character: CharacterType) =>
        character.image?.default ? getImagePath(character.image.default) : undefined,
    }
  )

  const emit = defineEmits<{
    characterClick: [character: CharacterType, isRightClick: boolean]
  }>()

  // サイズ設定
  const SIZE_CONFIG = {
    xs: { avatar: 'w-8 h-8' },
    sm: { avatar: 'w-10 h-10' },
    md: { avatar: 'w-12 h-12' },
    lg: { avatar: 'w-16 h-16' },
    xl: { avatar: 'w-20 h-20' },
  } as const

  const avatarSize = computed(() => SIZE_CONFIG[props.displaySize].avatar)

  const handleClick = (character: CharacterType, isRightClick: boolean) => {
    if (props.clickable) {
      emit('characterClick', character, isRightClick)
    }
  }
</script>
