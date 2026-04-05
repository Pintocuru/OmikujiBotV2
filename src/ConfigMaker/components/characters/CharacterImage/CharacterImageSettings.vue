<!-- src/ConfigMaker/components/characters/CharacterImage/CharacterImageSettings.vue -->
<template>
  <ImageSettingsInfo />

  <!-- サムネイル一覧（クリックで編集） -->
  <div class="flex gap-2 mb-2">
    <input type="text" class="input input-sm" placeholder="新しい感情キー（例: surprised）" v-model="newEmotionKey" />
    <button class="btn btn-sm btn-primary" @click="handleAddEmotion" :disabled="!newEmotionKey.trim()">
      <Plus class="w-4 h-4" />追加
    </button>
  </div>

  <EmotionGrid :images="currentImages" @select="handleSelectEmotion" />

  <!-- 編集ダイアログ -->
  <EmotionEditModal
    ref="editModalRef"
    :model-value="currentImages"
    :selected-item-key="selectedItemKey"
    :is-default-filled="isDefaultFilled"
    :initial-emotion-key="editingEmotionKey"
    @update="handleUpdate"
    @updateName="handleUpdateName"
    @reset="handleReset"
    @remove="handleRemoveEmotion"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { CharacterImageSetSchema, CharacterImageType } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import ImageSettingsInfo from './ImageSettingsInfo.vue'
  import EmotionGrid from './EmotionGrid.vue'
  import EmotionEditModal from './EmotionEditModal.vue'

  const props = defineProps<{
    modelValue: CharacterImageType
    selectedItemKey: string | null
  }>()

  const { updateRecordProperty } = useOmikujiStore()
  const editModalRef = ref<InstanceType<typeof EmotionEditModal> | null>(null)
  const editingEmotionKey = ref<string | null>(null)
  const newEmotionKey = ref('')

  const handleSelectEmotion = (key: string) => {
    editingEmotionKey.value = key
    editModalRef.value?.showModal()
  }

  const handleAddEmotion = () => {
    const key = newEmotionKey.value.trim()
    if (!key || key in currentImages.value) return
    pushImages({ ...currentImages.value, [key]: { label: key, src: [] } })
    newEmotionKey.value = ''
    // 追加直後に編集ダイアログを開く
    editingEmotionKey.value = key
    editModalRef.value?.showModal()
  }

  const currentImages = computed(() => props.modelValue ?? CharacterImageSetSchema.parse({}))

  const isDefaultFilled = computed(() => {
    return currentImages.value['default']?.src.some((v) => v.trim() !== '') ?? false
  })

  const imageExtensions = ['png', 'gif', 'webp', 'jpg', 'jpeg', 'svg']
  const extensionIndexMap = new Map<string, number>()

  const pushImages = (newImages: CharacterImageType) => {
    if (!props.selectedItemKey) return
    updateRecordProperty('characters', props.selectedItemKey, 'image', newImages)
  }

  const handleUpdate = (key: string, src: string[]) => {
    const item = currentImages.value[key]
    pushImages({ ...currentImages.value, [key]: { ...item, src } })
  }

  const handleUpdateName = (key: string, name: string) => {
    const item = currentImages.value[key]
    pushImages({ ...currentImages.value, [key]: { ...item, label: name } })
  }

  const handleReset = (key: string) => {
    const currentIndex = extensionIndexMap.get(key) ?? 0
    extensionIndexMap.set(key, (currentIndex + 1) % imageExtensions.length)
    const ext = imageExtensions[currentIndex]
    const newPath = `${props.selectedItemKey}/${key}.${ext}`
    const currentSrc = currentImages.value[key]?.src ?? []
    const newSrc = currentSrc.length === 0 ? [newPath] : [newPath, ...currentSrc.slice(1)]
    handleUpdate(key, newSrc)
  }

  const handleRemoveEmotion = (key: string) => {
    const { [key]: _, ...rest } = currentImages.value
    pushImages(rest as CharacterImageType)
  }
</script>
