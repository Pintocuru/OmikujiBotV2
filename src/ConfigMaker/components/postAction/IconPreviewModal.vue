<!-- src/configMaker/components/postAction/IconPreviewModal.vue -->
<template>
 <dialog ref="modalRef" class="modal">
  <div class="modal-box max-w-4xl">
   <h3 class="font-bold text-lg mb-4 text-base-content">{{ characterName }} - アイコン選択</h3>

   <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
    <div
     v-for="emotion in characterEmotions"
     :key="emotion"
     @click="selectEmotion(emotion)"
     class="cursor-pointer p-3 rounded-lg border-2 transition-all hover:shadow-lg"
     :class="[
      currentIconKey === emotion
       ? 'border-primary bg-primary-focus/10'
       : 'border-base-200 hover:border-base-300'
     ]"
    >
     <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center">
       <CharacterIcon
        :characterKey="characterKey"
        :iconKey="emotion"
        imgClass="max-w-full max-h-full object-contain rounded-full"
        fallbackClass="text-gray-400"
       />
      </div>
      <p class="text-base-content">{{ emotionLabels[emotion] }}</p>
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
import { ref, computed, Ref } from 'vue';
import { emotionLabels, characterEmotions, CharacterEmotionType } from '@/types/';
import CharacterIcon from '@ConfigComponents/parts/CharacterIcon.vue';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';

const props = defineProps<{
 characterKey: string;
 currentIconKey: CharacterEmotionType; // 現在選択されているアイコン
}>();

const emit = defineEmits<{
 'select:icon': [iconKey: CharacterEmotionType];
}>();

// ストアを使用
const omikujiStore = useOmikujiStore();
const charactersMap = computed(() => omikujiStore.getCategoryMap('characters'));

const modalRef: Ref<HTMLDialogElement | null> = ref(null);

const characterName = computed(() => {
 const character = charactersMap.value[props.characterKey];
 return character?.name || '';
});

const selectEmotion = (emotion: CharacterEmotionType) => {
 emit('select:icon', emotion);
 closeModal();
};

const showModal = () => {
 modalRef.value?.showModal();
};

const closeModal = () => {
 modalRef.value?.close();
};

// 親コンポーネントからモーダルを表示するための関数を公開
defineExpose({
 showModal,
 closeModal
});
</script>
