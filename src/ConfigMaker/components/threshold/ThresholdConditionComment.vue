<!-- src/configMaker/components/comments/ThresholdConditionComment.vue -->
<template>
 <div class="form-control bg-base-100 p-3 rounded-lg">
  <SettingItem
   label="適用するチャットワード"
   description="正規表現対応、詳細は生成AIで。"
   :show-reset="false"
  >
   <div class="space-y-3">
    <!-- 現在の条件一覧 -->
    <div v-if="modelValue.length > 0" class="space-y-2">
     <div class="flex flex-wrap gap-2">
      <div
       v-for="(comment, index) in modelValue"
       :key="index"
       class="badge badge-secondary badge-sm gap-1 group"
      >
       {{ comment }}
       <button
        @click="removeComment(index)"
        class="btn btn-sm btn-ghost btn-circle h-4 w-4 min-h-0 p-0 opacity-60 group-hover:opacity-100"
        title="削除"
       >
        ✕
       </button>
      </div>
     </div>
    </div>

    <!-- 新しい条件追加 -->
    <div class="space-y-2">
     <div class="flex gap-2">
      <div class="flex-1">
       <input
        v-model="newComment"
        type="text"
        placeholder="例: ^こんにちは|おはよう$ (正規表現可)"
        class="input input-bordered input-sm w-full"
        @keyup.enter="addComment"
       />
      </div>
      <button
       @click="addComment"
       :disabled="!newComment.trim()"
       class="btn btn-primary btn-sm px-4 flex items-center gap-1"
      >
       ＋ 追加
      </button>
     </div>
    </div>
   </div>
  </SettingItem>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SettingItem from '@/ConfigMaker/components/parts/SettingItem.vue';

const props = defineProps<{ modelValue: string[] }>();
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

const newComment = ref('');

const addComment = () => {
 const trimmed = newComment.value.trim();
 if (!trimmed) return;

 // 重複チェック
 if (props.modelValue.includes(trimmed)) {
  return;
 }

 emit('update:modelValue', [...props.modelValue, trimmed]);
 newComment.value = '';
};

const removeComment = (index: number) => {
 emit(
  'update:modelValue',
  props.modelValue.filter((_, i) => i !== index)
 );
};
</script>
