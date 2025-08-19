<!-- src/configMaker/components/comments/IconSelector.vue -->
<template>
  <div class="form-control">
    <label class="label py-0">
      <span class="label-text text-xs">🎨 アイコン</span>
    </label>
    <div class="flex gap-1">
      <select v-model="localIconKey" class="select select-bordered select-sm flex-1">
        <option v-for="emotion in availableEmotions" :key="emotion" :value="emotion">
          {{ emotionLabels[emotion] }}
        </option>
      </select>
      <div class="relative">
        <button
          @click="showIconPreview"
          @mouseenter="showHoverPreview = true"
          @mouseleave="showHoverPreview = false"
          class="btn btn-sm btn-outline"
          title="アイコンプレビュー"
          :disabled="availableEmotions.length === 0"
        >
          <Eye class="w-4 h-4" />
        </button>

        <div
          v-if="showHoverPreview && hasEmotion(characterKey, localIconKey)"
          class="absolute top-full right-0 mt-1 p-2 bg-white border rounded shadow-lg z-10 pointer-events-none"
        >
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-2">{{ characterName }}</p>
            <p class="text-xs text-gray-500 mb-2">{{ emotionLabels[localIconKey] }}</p>
            <CharacterIcon
              :characterKey="characterKey"
              :iconKey="localIconKey"
              imgClass="max-w-16 max-h-16 object-contain rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <IconPreviewModal
    ref="iconPreviewModalRef"
    :characterKey="characterKey"
    :currentIconKey="localIconKey"
    @select:icon="handleIconSelect"
  />
</template>

<script setup lang="ts">
  import { ref, computed, Ref, watch } from 'vue'
  import { emotionLabels, CharacterEmotionType } from '@/types/'
  import CharacterIcon from '@ConfigComponents/parts/CharacterIcon.vue'
  import IconPreviewModal from '@ConfigComponents/postAction/IconPreviewModal.vue'
  import { Eye } from 'lucide-vue-next'
  import { useCharacterEmotions } from '@ConfigComponents/parts/useCharacterEmotions'

  const props = defineProps<{
    characterKey: string
    iconKey: CharacterEmotionType
  }>()

  const emit = defineEmits<{
    'update:iconKey': [value: string]
    showPreview: [characterKey: string, iconKey: CharacterEmotionType]
  }>()

  // キャラクター感情のコンポーザブルを使用
  const { getAvailableEmotions, hasEmotion, charactersMap } = useCharacterEmotions()

  const showHoverPreview = ref(false)
  const iconPreviewModalRef: Ref<InstanceType<typeof IconPreviewModal> | null> = ref(null)

  // 利用可能な感情のみを取得
  const availableEmotions = computed(() => getAvailableEmotions(props.characterKey))

  const localIconKey = computed({
    get: () => props.iconKey,
    set: (newValue) => {
      emit('update:iconKey', newValue)
    },
  })

  const characterName = computed(() => {
    const character = charactersMap.value[props.characterKey]
    return character?.name || ''
  })

  // 現在選択されているアイコンが利用不可能な場合、利用可能な最初のものに変更
  watch(
    [availableEmotions, () => props.iconKey],
    ([emotions, currentIcon]) => {
      if (emotions.length > 0 && !emotions.includes(currentIcon)) {
        emit('update:iconKey', emotions[0])
      }
    },
    { immediate: true }
  )

  const showIconPreview = () => {
    iconPreviewModalRef.value?.showModal()
  }

  const handleIconSelect = (selectedIcon: CharacterEmotionType) => {
    localIconKey.value = selectedIcon
  }
</script>
