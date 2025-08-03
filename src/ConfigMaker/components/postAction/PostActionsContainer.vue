<!-- src/configMaker/components/postAction/PostActionsContainer.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <!-- タイトルバー -->
  <PostActionsHeader @add-action="$emit('add-action')" @sort-by-delay="$emit('sort-by-delay')" />

  <!-- 本体 -->
  <div class="card-body p-2">
   <div v-if="editingActions.length === 0" class="text-center text-gray-500 py-8">
    Post Actions がありません。「➕ 追加」ボタンで追加してください。
   </div>

   <div v-else class="space-y-4">
    <PostActionItem
     v-for="(action, index) in editingActions"
     :key="index"
     :action="action"
     :index="index"
     :character-options="characterOptions"
     @duplicate="duplicateAction"
     @remove="removeAction"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { PostActionType } from '@type/';
import PostActionsHeader from './PostActionsHeader.vue';
import PostActionItem from './PostActionItem.vue';

// Props
const props = defineProps<{
 editingActions: PostActionType[];
 characterOptions: Array<{ value: string; label: string }>;
}>();

// Emits
const emit = defineEmits<{
 'add-action': [];
 'sort-by-delay': [];
}>();

// WordParty入力モード管理
const wordPartyInputModes = reactive<Record<number, 'select' | 'manual'>>({});

// Action management methods
const removeAction = (index: number) => {
 props.editingActions.splice(index, 1);

 // WordParty入力モードも削除し、インデックスを再調整
 const newModes: Record<number, 'select' | 'manual'> = {};
 Object.keys(wordPartyInputModes).forEach((key) => {
  const keyNum = Number(key);
  if (keyNum < index) {
   newModes[keyNum] = wordPartyInputModes[keyNum];
  } else if (keyNum > index) {
   newModes[keyNum - 1] = wordPartyInputModes[keyNum];
  }
 });

 Object.keys(wordPartyInputModes).forEach((key) => {
  delete wordPartyInputModes[Number(key)];
 });
 Object.assign(wordPartyInputModes, newModes);
};

const duplicateAction = (index: number) => {
 const original = props.editingActions[index];
 const duplicated = JSON.parse(JSON.stringify(original));
 props.editingActions.splice(index + 1, 0, duplicated);

 // WordParty入力モードも複製し、インデックスを再調整
 const newModes: Record<number, 'select' | 'manual'> = {};
 Object.keys(wordPartyInputModes).forEach((key) => {
  const keyNum = Number(key);
  if (keyNum <= index) {
   newModes[keyNum] = wordPartyInputModes[keyNum];
  } else {
   newModes[keyNum + 1] = wordPartyInputModes[keyNum];
  }
 });

 // 複製されたアクションの入力モードを設定
 newModes[index + 1] = wordPartyInputModes[index] || 'select';

 Object.keys(wordPartyInputModes).forEach((key) => {
  delete wordPartyInputModes[Number(key)];
 });
 Object.assign(wordPartyInputModes, newModes);
};
</script>
