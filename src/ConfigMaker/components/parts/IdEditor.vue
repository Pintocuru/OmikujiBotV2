<!-- src/configMaker/components/parts/IdEditor.vue -->
<template>
 <div>
  <!-- IDエディタボタン -->
  <button
   @click="handleOpenDialog"
   class="btn btn-sm btn-outline tooltip tooltip-bottom"
   data-tip="IDを変更します。参照している他の設定も影響を受ける可能性があります。"
  >
   <span class="inline">📝</span>
   <span class="hidden md:inline">ID編集</span>
  </button>

  <!-- ダイアログ -->
  <div v-if="isDialogOpen" class="modal modal-open">
   <div class="modal-box">
    <h3 class="font-bold text-lg">{{ dialogTitle }}ID編集</h3>

    <div class="py-4">
     <SettingItem label="現在のID" :showReset="false">
      <div class="input input-bordered bg-base-200 text-gray-600">
       {{ currentId }}
      </div>
     </SettingItem>

     <SettingItem label="新しいID" :showReset="false" class="form-control mt-4">
      <input
       type="text"
       v-model="newId"
       placeholder="新しいIDを入力"
       class="input input-bordered"
       :class="{ 'input-error': hasError }"
       @input="handleValidateId"
      />
      <label class="label" v-if="hasError">
       <span class="label-text-alt text-error">{{ errorMessage }}</span>
      </label>
     </SettingItem>

     <!-- キャラクターモードの場合、使用箇所を表示 -->
     <div v-if="category === 'characters' && characterUsage" class="mt-4">
      <div class="alert alert-info">
       <span class="text-sm">
        📊 このキャラクターの使用状況:
        <ul class="list-disc list-inside mt-2">
         <li v-if="characterUsage.comments.length > 0">
          コメントルール: {{ characterUsage.comments.length }}箇所
         </li>
         <li v-if="characterUsage.timers.length > 0">
          タイマールール: {{ characterUsage.timers.length }}箇所
         </li>
         <li v-if="characterUsage.comments.length === 0 && characterUsage.timers.length === 0">
          使用されていません
         </li>
        </ul>
       </span>
      </div>
     </div>

     <div
      v-if="category === 'placeholders' || category === 'characters'"
      class="alert alert-warning mt-4"
     >
      ⚠️
      <span class="text-sm">
       IDを変更すると、この{{
        getItemTypeLabel()
       }}を参照している他の設定も影響を受ける可能性があります。
       <span v-if="category === 'characters'">
        <br />キャラクターの場合、コメントルールとタイマールールの投稿アクションも自動的に更新されます。
       </span>
      </span>
     </div>
    </div>

    <ModalFooterActions
     :on-cancel="closeDialog"
     :on-save="handleSaveId"
     :disabled="hasError || !newId.trim() || newId === currentId"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { SelectCategoryType } from '@/types/';
import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { useIdEditor } from './useIdEditor';

// Props
const props = defineProps<{
 currentId: string;
 category: SelectCategoryType;
}>();

// コンポーザブルを使用
const {
 isDialogOpen,
 newId,
 errorMessage,
 characterUsage,
 hasError,
 getDialogTitle,
 validateId,
 openDialog,
 closeDialog,
 saveId
} = useIdEditor();

// computed
const dialogTitle = computed(() => getDialogTitle(props.category));

/**
 * アイテムタイプのラベルを取得
 */
const getItemTypeLabel = (): string => {
 const labels = {
  characters: 'キャラクター',
  placeholders: 'プレースホルダー',
  comments: 'コメントルール',
  timers: 'タイマールール'
 } as const;
 return labels[props.category];
};

// メソッド
const handleOpenDialog = () => {
 openDialog(props.currentId, props.category);
};

const handleValidateId = () => {
 validateId(newId.value, props.category, props.currentId);
};

const handleSaveId = () => {
 saveId(props.currentId, props.category);
};

// propsの変更を監視して、キャラクターの使用状況を更新
watch(
 () => props.currentId,
 (newCurrentId) => {
  if (props.category === 'characters' && isDialogOpen.value && characterUsage.value !== undefined) {
   // キャラクターの使用状況を再取得
   openDialog(newCurrentId, props.category);
  }
 }
);
</script>
