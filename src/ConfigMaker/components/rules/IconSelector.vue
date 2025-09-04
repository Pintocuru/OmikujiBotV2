<!-- src/configMaker/components/comments/IconSelector.vue -->
<template>
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
        :disabled="availableEmotions.length === 0"
      >
        <User class="w-4 h-4" />
      </button>

      <!-- アイコンプレビューボタン -->
      <div
        v-if="showHoverPreview && hasEmotion(characterKey, localIconKey)"
        class="absolute right-0 p-4 bg-base-100 border rounded shadow-lg z-10 pointer-events-none"
      >
        <!-- アイコン表示 -->
        <div class="text-center">
          <CharacterIcon
            :characterKey="characterKey"
            :iconKey="localIconKey"
            imgClass="max-w-32 max-h-32 object-contain rounded-full"
          />
          <p class="text-sm text-base-content mt-4">{{ emotionLabels[localIconKey] }}</p>
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
  import { User } from 'lucide-vue-next'
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
