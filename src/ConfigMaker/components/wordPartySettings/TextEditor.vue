<!-- src/configMaker/components/wordPartySettings/TextEditor.vue -->
<template>
 <div class="card bg-base-300 shadow-lg">
  <div class="card-title bg-secondary text-secondary-content text-lg p-2 pl-4 rounded-t">
   リストのテキスト編集
  </div>
  <div class="card-body">
   <!-- ゲームスクリプトの説明 -->
   <div class="alert alert-info w-full">
    <Info class="w-5 h-5 mt-0.5 shrink-0" />
    <div class="space-y-1">
     <p>
      <code class="label bg-accent text-accent-content"> WordPartyリスト </code>は、任意のWordParty
      テンプレートを発動させるためのリストです。
     </p>
     <p>
      予めこのリストに記載しておくと、<code class="label bg-accent text-accent-content"
       >おみくじ設定 > 詳細設定 > Post Actions 編集</code
      >
      から
     </p>
     <p>このリストに記載された内容を選択することができます。</p>
     <p class="pt-2">
      初期設定では、
      <a
       href="https://booth.pm/ja/items/6048048"
       target="_blank"
       rel="noopener"
       class="inline-block px-2 py-1 rounded bg-secondary text-secondary-content hover:bg-secondary/70 transition"
      >
       おみくじBOT用 word-party
      </a>
      のデータが入っています。
     </p>
    </div>
   </div>

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
import { WordPartySettings } from '@/types/';
import { Info } from 'lucide-vue-next';

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
