<!-- src/ConfigMaker/components/postAction/IconSelector/IconSelectorModal.vue -->
<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box max-w-4xl space-y-4">
      <h3 class="font-bold text-lg">{{ characterName }} - アイコン選択</h3>

      <EmotionGrid :images="characterImages" :selected-key="currentIconKey" readonly @select="selectEmotion" />

      <div class="modal-action">
        <button @click="closeModal" class="btn">キャンセル</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, computed, type Ref } from 'vue'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import EmotionGrid from '@config/components/characters/CharacterImage/EmotionGrid.vue'

  const props = defineProps<{
    characterKey: string
    currentIconKey: string
  }>()

  const emit = defineEmits<{
    'select:icon': [iconKey: string]
  }>()

  const { characterMap } = useCharacterManager()
  const modalRef: Ref<HTMLDialogElement | null> = ref(null)

  const characterName = computed(() => characterMap.value[props.characterKey]?.name ?? '')
  const characterImages = computed(() => characterMap.value[props.characterKey]?.image ?? {})

  const selectEmotion = (key: string) => {
    emit('select:icon', key)
    closeModal()
  }

  const showModal = () => modalRef.value?.showModal()
  const closeModal = () => modalRef.value?.close()
  defineExpose({ showModal, closeModal })
</script>
