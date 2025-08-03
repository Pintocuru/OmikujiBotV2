<!-- src/configMaker/components/wordPartySettings/TextEditor.vue -->
<template>
 <div class="card bg-base-300 shadow-lg">
  <div class="card-title bg-secondary text-secondary-content text-lg p-2 pl-4 rounded-t">
   リストのテキスト編集
  </div>
  <div class="card-body">
   <!-- テキストエディタ（直接表示） -->
   <div class="mb-2 text-sm text-base-content/70">
    <p>書式: 名前,パターン（1行につき1つ）</p>
    <p>例: 効果音:ドアチャイム1,^!ドアチャイム1</p>
   </div>
   <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="textarea textarea-bordered w-full h-96 font-mono text-sm"
    placeholder="効果音:ドアチャイム1,^!ドアチャイム1&#10;効果音:レベルアップ,^!レベルアップ&#10;効果音:シャキーン2,^!シャキーン2"
   ></textarea>
   <div class="flex justify-end space-x-2 mt-4">
    <button @click="$emit('reset')" class="btn btn-outline">リセット</button>
    <button @click="$emit('save')" class="btn btn-primary">保存</button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { WordPartySettings } from '@type/';

defineProps<{
 modelValue: string;
 settings: WordPartySettings[];
}>();

defineEmits<{
 'update:modelValue': [value: string];
 save: [];
 reset: [];
}>();
</script>
