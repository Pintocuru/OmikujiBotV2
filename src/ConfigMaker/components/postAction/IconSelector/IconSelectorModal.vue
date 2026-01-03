<!-- src\ConfigMaker\components\postAction\IconSelector\IconSelectorModal.vue -->
<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box max-w-4xl space-y-4">
      <h3 class="font-bold text-lg text-base-content">{{ characterName }} - アイコン選択</h3>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div
          v-for="emotion in characterEmotions"
          :key="emotion"
          @click="selectEmotion(emotion)"
          class="cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg"
          :class="[
            currentIconKey === emotion ? 'border-primary bg-primary-focus' : 'border-base-200 hover:border-base-300',
          ]"
        >
          <div class="text-center">
            <div class="w-32 h-32 mx-auto rounded-full items-center justify-center">
              <LayerImage :layers="iconSrc(characterKey, emotion)" :size="32" />
            </div>
            <p class="text-sm text-base-content mt-4">{{ emotionLabels[emotion] }}</p>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button @click="closeModal" class="btn">キャンセル</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, computed, Ref } from 'vue'
  import { emotionLabels, CharacterEmotionType, characterEmotions } from '@/types/'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'

  const props = defineProps<{
    characterKey: string
    currentIconKey: CharacterEmotionType
  }>()

  const emit = defineEmits<{
    'select:icon': [iconKey: CharacterEmotionType]
  }>()

  // キャラクター感情のコンポーザブルを使用
  const { getAvailableEmotions, charactersMap, iconSrc } = useCharacterManager()

  const modalRef: Ref<HTMLDialogElement | null> = ref(null)

  const characterName = computed(() => {
    const character = charactersMap.value[props.characterKey]
    return character?.name || ''
  })

  // 利用可能な感情のみを表示
  const availableEmotions = computed(() => getAvailableEmotions(props.characterKey))

  const selectEmotion = (emotion: CharacterEmotionType) => {
    emit('select:icon', emotion)
    closeModal()
  }

  const showModal = () => {
    modalRef.value?.showModal()
  }

  const closeModal = () => {
    modalRef.value?.close()
  }

  defineExpose({
    showModal,
    closeModal,
  })
</script>
