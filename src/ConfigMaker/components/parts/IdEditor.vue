<!-- src/configMaker/components/parts/IdEditor.vue -->
<template>
 <div>
  <!-- IDエディタボタン -->
  <button
   @click="openDialog(currentId, category)"
   class="btn btn-sm btn-outline btn-primary tooltip tooltip-bottom min-w-fit whitespace-nowrap"
   data-tip="IDを変更します。参照している他の設定も影響を受ける可能性があります。"
  >
   <span class="inline">📝</span>
   <span class="hidden sm:inline ml-1">ID編集</span>
  </button>

  <!-- ダイアログ -->
  <div v-if="isDialogOpen" class="modal modal-open">
   <div class="modal-box">
    <h3 class="font-bold text-lg text-primary">{{ dialogTitle }}ID編集</h3>

    <div class="py-4">
     <SettingItem label="現在のID" :showReset="false">
      <div class="input input-bordered bg-neutral text-neutral-content select-all">
       {{ currentId }}
      </div>
     </SettingItem>

     <SettingItem label="新しいID" :showReset="false" class="form-control mt-4">
      <input
       type="text"
       v-model="newId"
       placeholder="新しいIDを入力"
       class="input input-bordered focus:input-primary"
       :class="{ 'input-error': hasError }"
       @input="validateId(newId, category, currentId)"
      />
      <label class="label" v-if="hasError">
       <span class="label-text-alt text-error font-bold">{{ errorMessage }}</span>
      </label>
     </SettingItem>

     <!-- キャラクター使用状況 -->
     <div v-if="category === 'characters' && characterUsage" class="mt-4">
      <div class="bg-primary text-primary-content p-4 rounded-lg">
       <div class="flex items-start">
        <span class="text-sm">
         <span class="font-bold">📊 このキャラクターの使用状況:</span>
         <ul class="list-disc list-inside mt-2 space-y-1">
          <li v-if="characterUsage.comments.length > 0">
           コメントルール: <span class="font-bold">{{ characterUsage.comments.length }}箇所</span>
          </li>
          <li v-if="characterUsage.timers.length > 0">
           タイマールール: <span class="font-bold">{{ characterUsage.timers.length }}箇所</span>
          </li>
          <li v-if="characterUsage.comments.length === 0 && characterUsage.timers.length === 0">
           使用されていません
          </li>
         </ul>
        </span>
       </div>
      </div>
     </div>

     <!-- 警告メッセージ -->
     <div
      v-if="category === 'placeholders' || category === 'characters'"
      class="bg-secondary text-secondary-content p-4 rounded-lg mt-4"
     >
      <div class="flex items-start">
       <span class="text-2xl mr-3">⚠️</span>
       <span class="text-sm">
        <span class="font-bold">
         IDを変更すると、この{{
          getItemTypeLabel(category)
         }}を参照している他の設定も影響を受ける可能性があります。
        </span>
        <span v-if="category === 'characters'" class="block mt-2">
         キャラクターの場合、コメントルールとタイマールールの投稿アクションも自動的に更新されます。
        </span>
       </span>
      </div>
     </div>
    </div>

    <ModalFooterActions
     :on-cancel="closeDialog"
     :on-save="() => saveId(currentId, category)"
     :disabled="hasError || !newId.trim() || newId === currentId"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { RecordCategoryType } from '@/types/';
import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { useIdEditor } from './useIdEditor';

const props = defineProps<{
 currentId: string;
 category: RecordCategoryType;
}>();

const {
 isDialogOpen,
 newId,
 errorMessage,
 characterUsage,
 hasError,
 dialogTitle,
 validateId,
 openDialog,
 closeDialog,
 saveId,
 getItemTypeLabel
} = useIdEditor();
</script>
