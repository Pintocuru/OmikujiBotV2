<!-- src/configMaker/components/comments/OmikujiSetEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex justify-between items-center">
   <span>おみくじ設定 ({{ modelValue.length }}種/ 重さ: {{ totalWeight }})</span>

   <div class="flex items-center gap-2">
    <!-- キャラクター一括変更ボタン -->
    <CharacterBulkChanger
     :model-value="modelValue"
     @update:model-value="$emit('update:modelValue', $event)"
    />
    <!-- おみくじテストボタン -->
    <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
     <button
      @click="postTestOmikuji(modelValue)"
      class="btn btn-ghost btn-sm"
      :disabled="modelValue.length === 0"
     >
      <Dices class="w-4 h-4" />
      抽選テスト
     </button>
    </div>
   </div>
  </div>
  <div class="card-body p-3">
   <!-- おみくじセットコンポーネント -->
   <div
    v-for="(omikuji, index) in modelValue"
    :key="index"
    class="card bg-base-100 p-3 border-l-4"
    :class="{
     'opacity-50': dragIndex === index,
     'border-l-primary': index % 2 === 0,
     'border-l-secondary': index % 2 === 1
    }"
    @dragover.prevent
    @drop="onDrop(index, $event)"
   >
    <!-- OmikujiItem コンポーネント -->
    <OmikujiItem
     :omikuji="omikuji"
     :disable-delete="modelValue.length <= 1"
     @dragstart="onDragStart(index, $event)"
     @dragend="onDragEnd"
     @update:name="updateOmikuji(index, 'name', $event)"
     @update:weight="updateOmikuji(index, 'weight', $event)"
     @duplicate="duplicateOmikuji(index)"
     @delete="removeOmikuji(index)"
    />

    <!-- Post Actions Editor コンポーネント JSON編集機能付き -->
    <PostActionsEditor v-model="omikuji.postActions" />
   </div>

   <button @click="addOmikuji" class="btn btn-primary btn-sm w-full">
    <Plus class="w-4 h-4" />
    おみくじセットを追加
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { OmikujiSetSchema, OmikujiSetType } from '@type/';
import CharacterBulkChanger from './CharacterBulkChanger.vue';
import OmikujiItem from './OmikujiSetBasic.vue';
import PostActionsEditor from '@ConfigComponents/postAction/PostActionsEditor.vue';
import { useTestPost } from '@ConfigScript/useTestPost';
import { Dices, Plus } from 'lucide-vue-next';

const props = defineProps<{
 modelValue: OmikujiSetType[];
}>();
const emit = defineEmits<{
 'update:modelValue': [value: OmikujiSetType[]];
}>();

const { postTestOmikuji } = useTestPost();

// 合計重みの計算
const totalWeight = computed(() => {
 return props.modelValue.reduce((sum, omikuji) => sum + (omikuji.weight || 0), 0);
});

// ドラッグ&ドロップ関連
const dragIndex = ref<number | null>(null);

const onDragStart = (index: number, event: DragEvent) => {
 dragIndex.value = index;
 if (event.dataTransfer) {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', index.toString());
 }
};

const onDragEnd = () => {
 dragIndex.value = null;
};

const onDrop = (dropIndex: number, event: DragEvent) => {
 event.preventDefault();
 const draggedIndex = dragIndex.value;

 if (draggedIndex !== null && draggedIndex !== dropIndex) {
  const newValue = [...props.modelValue];
  const draggedItem = newValue[draggedIndex];

  // 配列から削除
  newValue.splice(draggedIndex, 1);

  // 新しい位置に挿入
  const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
  newValue.splice(insertIndex, 0, draggedItem);

  emit('update:modelValue', newValue);
 }

 dragIndex.value = null;
};

// 統合された更新関数
const updateOmikuji = (index: number, key: keyof OmikujiSetType, value: any) => {
 const newValue = [...props.modelValue];
 newValue[index] = { ...newValue[index], [key]: value };
 emit('update:modelValue', newValue);
};

const addOmikuji = () => {
 emit('update:modelValue', [...props.modelValue, OmikujiSetSchema.parse({})]);
};

const removeOmikuji = (index: number) => {
 if (props.modelValue.length <= 1) return;
 const newValue = [...props.modelValue];
 newValue.splice(index, 1);
 emit('update:modelValue', newValue);
};

const duplicateOmikuji = (index: number) => {
 const original = props.modelValue[index];
 const duplicated = { ...JSON.parse(JSON.stringify(original)), name: `${original.name} (コピー)` };
 const newValue = [...props.modelValue];
 newValue.splice(index + 1, 0, duplicated);
 emit('update:modelValue', newValue);
};
</script>
