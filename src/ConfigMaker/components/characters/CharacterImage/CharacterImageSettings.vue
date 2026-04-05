<!-- src/ConfigMaker/components/characters/CharacterImage/CharacterImageSettings.vue -->
<template>
  <div class="flex gap-2 mb-2">
    <input type="text" class="input input-sm" placeholder="新しい感情キー（例: surprised）" v-model="newEmotionKey" />
    <button class="btn btn-sm btn-primary" @click="handleAddEmotion" :disabled="!newEmotionKey.trim()">
      <Plus class="w-4 h-4" />追加
    </button>
  </div>

  <EmotionPresetButtons :existing-keys="Object.keys(currentImages)" @add="handleAddPreset" />

  <EmotionGrid :images="currentImages" @select="handleSelectEmotion" />

  <EmotionEditModal
    ref="editModalRef"
    :model-value="currentImages"
    :selected-item-key="selectedItemKey"
    :is-default-filled="isDefaultFilled"
    :initial-emotion-key="editingEmotionKey"
    @update="handleUpdate"
    @updateName="handleUpdateName"
    @updateAnimation="handleUpdateAnimation"
    @remove="handleRemoveEmotion"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Plus } from 'lucide-vue-next'
  import { CharacterImageSetSchema, CharacterImageType, CharacterAnimationType } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import EmotionPresetButtons from './EmotionPresetButtons.vue'

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

  // ── 現在の画像データ ──────────────────────────────────────────────────────
  const currentImages = computed(() => props.modelValue ?? CharacterImageSetSchema.parse({}))

  const isDefaultFilled = computed(() => currentImages.value['default']?.src.some((v) => v.trim() !== '') ?? false)

  // ── Store への書き込み ────────────────────────────────────────────────────
  const pushImages = (newImages: CharacterImageType) => {
    if (!props.selectedItemKey) return
    updateRecordProperty('characters', props.selectedItemKey, 'image', newImages)
  }

  // ── 感情の追加・選択 ──────────────────────────────────────────────────────
  const handleAddPreset = (key: string, label: string) => {
    if (key in currentImages.value) return
    pushImages({ ...currentImages.value, [key]: { label, src: [`${props.selectedItemKey}/${key}.webp`] } })
    editingEmotionKey.value = key
    editModalRef.value?.showModal()
  }

  const handleSelectEmotion = (key: string) => {
    editingEmotionKey.value = key
    editModalRef.value?.showModal()
  }

  const handleAddEmotion = () => {
    const key = newEmotionKey.value.trim()
    if (!key || key in currentImages.value) return
    pushImages({ ...currentImages.value, [key]: { label: key, src: [] } })
    newEmotionKey.value = ''
    editingEmotionKey.value = key
    editModalRef.value?.showModal()
  }

  // ── モーダルからの emit ハンドラ ──────────────────────────────────────────
  const handleUpdate = (key: string, src: string[]) => {
    const item = currentImages.value[key]
    pushImages({ ...currentImages.value, [key]: { ...item, src } })
  }

  const handleUpdateName = (key: string, name: string) => {
    const item = currentImages.value[key]
    pushImages({ ...currentImages.value, [key]: { ...item, label: name } })
  }

  const handleUpdateAnimation = (key: string, animation: CharacterAnimationType | undefined) => {
    const item = currentImages.value[key]
    if (!item) return
    const { animation: _old, ...rest } = item
    pushImages({
      ...currentImages.value,
      [key]: animation ? { ...rest, animation } : { ...rest },
    })
  }

  // ── 感情の削除 ────────────────────────────────────────────────────────────
  const handleRemoveEmotion = (key: string) => {
    const { [key]: _, ...rest } = currentImages.value
    pushImages(rest as CharacterImageType)
  }
</script>
