<!-- src/configMaker/components/postAction/PostActionsEditDialog.vue -->
<template>
 <dialog ref="dialogRef" class="modal">
  <div class="modal-box max-w-max">
   <!-- 保存・キャンセルボタン -->
   <div class="mb-4">
    <ModalFooterActions :on-cancel="closeDialog" :on-save="saveActions" />
   </div>

   <!-- プレースホルダーリスト表示 -->
   <PlaceholderList :actions="editingActions" />

   <!-- Post編集ダイアログ -->
   <PostActionsContainer
    :editing-actions="editingActions"
    :character-options="characterOptions"
    @add-action="addAction"
    @sort-by-delay="sortByDelay"
   />

   <!-- 保存・キャンセルボタン -->
   <ModalFooterActions :on-cancel="closeDialog" :on-save="saveActions" />
  </div>
 </dialog>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue';
import { CharacterType, PostActionSchema, PostActionType } from '@type/';
import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue';
import PlaceholderList from '@ConfigComponents/placeholders/PlaceholderList.vue';
import PostActionsContainer from './PostActionsContainer.vue';

// Props
const props = defineProps<{
 actions: PostActionType[];
 charactersArray: CharacterType[];
}>();

// Emits
const emit = defineEmits<{
 'update:actions': [value: PostActionType[]];
}>();

// Refs
const dialogRef: Ref<HTMLDialogElement | null> = ref(null);
const editingActions: Ref<PostActionType[]> = ref([]);

// キャラクター選択肢
const characterOptions = computed(() => {
 return props.charactersArray.map((character) => ({
  value: character.id,
  label: character.name
 }));
});

// Dialog methods
const open = () => {
 editingActions.value = JSON.parse(JSON.stringify(props.actions));
 dialogRef.value?.showModal();
};

const closeDialog = () => {
 dialogRef.value?.close();
 editingActions.value = [];
};

const saveActions = () => {
 emit('update:actions', [...editingActions.value]);
 closeDialog();
};

// Action management methods
const addAction = () => {
 const characterId = props.charactersArray[0]?.id ?? '';
 const newAction = PostActionSchema.parse({ characterKey: characterId });
 editingActions.value.push(newAction);
};

// 遅延秒数でソートする機能
const sortByDelay = () => {
 editingActions.value.sort((a, b) => {
  const delayA = a.delaySeconds || 0;
  const delayB = b.delaySeconds || 0;
  return delayA - delayB;
 });
};

// Expose open method for parent component
defineExpose({
 open
});
</script>
