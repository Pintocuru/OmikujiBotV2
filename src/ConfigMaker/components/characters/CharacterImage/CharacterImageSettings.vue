<!-- src/configMaker/components/characters/CharacterImageSettings.vue -->
<template>
  <!-- 画像設定の説明 -->
  <ImageSettingsInfo />

  <!-- 各画像プレビュー -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
    <EmotionImageItem
      v-for="(emotion, key) in emotionLabels"
      :key="key"
      :emotion-key="key"
      :emotion-label="emotion"
      :current-value="currentImages[key]"
      :selected-item-key="selectedItemKey"
      :is-default-filled="isDefaultFilled"
      @update="handleUpdate"
      @reset="handleReset"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterEmotionType, CharacterImageSetSchema, CharacterImageType, emotionLabels } from '@/types/'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import ImageSettingsInfo from './ImageSettingsInfo.vue'
  import EmotionImageItem from './EmotionImageItem.vue'

  const props = defineProps<{
    modelValue: CharacterImageType
    selectedItemKey: string | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterImageType]
  }>()

  const omikujiStore = useOmikujiStore()
  const currentImages = computed(() => props.modelValue ?? CharacterImageSetSchema.parse({}))

  const isDefaultFilled = computed(() => {
    const layers = currentImages.value.default ?? []
    return layers.some((v) => v.trim() !== '')
  })

  const imageExtensions = ['png', 'gif', 'webp', 'jpg', 'jpeg', 'svg']
  const extensionIndexMap = new Map<CharacterEmotionType, number>()

  const handleUpdate = (key: CharacterEmotionType, value: string[]) => {
    if (!props.selectedItemKey) return
    const newImages = { ...currentImages.value, [key]: value }
    omikujiStore.updateRecordProperty('characters', props.selectedItemKey, 'image', newImages)
  }

  const handleReset = (key: CharacterEmotionType) => {
    if (!props.selectedItemKey) return

    const currentIndex = extensionIndexMap.get(key) || 0
    const nextIndex = (currentIndex + 1) % imageExtensions.length
    extensionIndexMap.set(key, nextIndex)

    const nextExt = imageExtensions[currentIndex]
    const newPath = `${props.selectedItemKey}/${key}.${nextExt}`
    const currentValue = currentImages.value[key]

    const newValue = currentValue.length === 0 ? [newPath] : [newPath, ...currentValue.slice(1)]
    handleUpdate(key, newValue)
  }
</script>
