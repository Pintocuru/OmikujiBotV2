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
        <LayerImage
          :isPreview="false"
          :layers="character.image?.default"
          :size="12"
          :border="true"
          class="object-cover"
          :class="imageClass"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterType } from '@/types'
  import { DisplaySize } from '@shared/types/CommonSchema'
  import LayerImage from '@/common/LayerImage.vue'

  const props = withDefaults(
    defineProps<{
      characters: CharacterType[]
      displaySize?: DisplaySize
      clickable?: boolean
      imageClass?: string
    }>(),
    {
      displaySize: 'md',
      clickable: false,
      imageClass: '',
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
