<!-- src/configMaker/components/parts/CharacterIcon.vue -->
<template>
 <div
  class="tooltip tooltip-top"
  :data-tip="`${charactersMap[props.characterKey]?.name} (${altText})`"
 >
  <img v-if="showImage" :src="iconSrc" :alt="altText" :class="imgClass" @error="onImageError" />
  <div v-else :class="fallbackClass">画像なし</div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { emotionLabels, CharacterEmotionType, getImagePath } from '@type/';
import { useCharacterStore } from '@ConfigStore/useCharacterStore';

const props = defineProps<{
 characterKey: string;
 iconKey: CharacterEmotionType;
 imgClass?: string;
 fallbackClass?: string;
}>();

const characterStore = useCharacterStore();
const charactersMap = computed(() => characterStore.rulesMap);

const iconSrc = computed(() =>
 getImagePath(charactersMap.value[props.characterKey]?.image[props.iconKey])
);
const altText = computed(() => emotionLabels[props.iconKey]);

const showImage = ref(true);
const onImageError = () => {
 showImage.value = false;
};
</script>
