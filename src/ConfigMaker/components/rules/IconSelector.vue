<!-- src/configMaker/components/comments/IconSelector.vue -->
<template>
  <div class="flex gap-1">
    <select v-model="localIconKey" class="select select-bordered select-sm flex-1">
      <option v-for="emotion in characterEmotions" :key="emotion" :value="emotion">
        {{ emotionLabels[emotion] }}
      </option>
    </select>
    <div class="relative">
      <button
        @click="showIconPreview"
        @mouseenter="showHoverPreview = true"
        @mouseleave="showHoverPreview = false"
        class="btn btn-sm btn-outline"
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
  import { ref, computed, Ref } from 'vue'
  import { emotionLabels, CharacterEmotionType, characterEmotions } from '@/types/'
  import CharacterIcon from '@ConfigComponents/parts/CharacterIcon.vue'
  import IconPreviewModal from '@/ConfigMaker/components/postAction/items/IconPreviewModal.vue'
  import { useCharacterEmotions } from '@ConfigComponents/parts/useCharacterEmotions'
  import { User } from 'lucide-vue-next'

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

  const showIconPreview = () => {
    iconPreviewModalRef.value?.showModal()
  }

  const handleIconSelect = (selectedIcon: CharacterEmotionType) => {
    localIconKey.value = selectedIcon
  }
</script>
