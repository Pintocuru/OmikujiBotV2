<!-- src/configMaker/components/parts/CharacterIcon.vue -->
<template>
  <div class="tooltip tooltip-right" :data-tip="`${charactersMap[props.characterKey]?.name} (${altText})`">
    <img v-if="showImage" :src="iconSrc" :alt="altText" :class="imgClass" @error="onImageError" />
    <div v-else class="avatar avatar-placeholder w-6 rounded-full text-xs bg-base-200 text-base-content">画像なし</div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { emotionLabels, CharacterEmotionType, getImagePath } from '@/types/'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

  const props = defineProps<{
    characterKey: string
    iconKey: CharacterEmotionType
    imgClass?: string
    fallbackClass?: string
  }>()
  // Pinia store
  const omikujiStore = useOmikujiStore()
  const charactersMap = computed(() => omikujiStore.getCategoryMap('characters'))

  const iconSrc = computed(() => {
    const imagePath = charactersMap.value[props.characterKey]?.image?.[props.iconKey]
    return imagePath ? getImagePath(imagePath) : ''
  })
  const altText = computed(() => emotionLabels[props.iconKey])

  const showImage = ref(true)
  const onImageError = () => {
    showImage.value = false
  }
</script>
