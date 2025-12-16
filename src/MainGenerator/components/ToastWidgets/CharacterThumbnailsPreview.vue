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
        :class="['w-12 h-12', 'rounded-full border border-base-100 shadow-lg']"
        :style="{ backgroundColor: character.color?.backgroundColor }"
      >
        <LayerImage
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
  import { CharacterType } from '@/types'
  import LayerImage from '@/common/LayerImage.vue'

  const props = withDefaults(
    defineProps<{
      characters: CharacterType[]
      clickable?: boolean
      imageClass?: string
    }>(),
    {
      clickable: false,
      imageClass: '',
    }
  )

  const emit = defineEmits<{
    characterClick: [character: CharacterType, isRightClick: boolean]
  }>()

  const handleClick = (character: CharacterType, isRightClick: boolean) => {
    if (props.clickable) emit('characterClick', character, isRightClick)
  }
</script>
