<!-- src/configMaker/components/comments/ScriptGameEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">ゲームスクリプト設定</div>
  <div class="card-body space-y-4">
   <!-- ゲームスクリプトの説明 -->
   <div class="alert alert-info w-full">
    <Info class="w-5 h-5 mt-0.5 shrink-0" />
    <div class="space-y-1">
     <p>
      <code class="label bg-accent text-accent-content"> ゲームスクリプト </code
      >とは、該当するルール適用時に起動し、複雑なおみくじを行うための機能です。
     </p>
     <p>
      ゲーム結果は
      <code class="label bg-accent text-accent-content">プレースホルダー</code>の形で出力されます。
     </p>
     <p>
      下記の
      <code class="label bg-accent text-accent-content"> ゲームスクリプトを使用</code>
      を押すと、おみくじ設定 の 詳細編集にある
      <code class="label bg-accent text-accent-content">プレースホルダー一覧</code>
      に項目が増えます。
     </p>
    </div>
   </div>

   <!-- スクリプト有効化チェックボックス -->
   <SettingItem label="ゲームスクリプトを使用" :showReset="false">
    <label class="label cursor-pointer justify-start gap-3">
     <input type="checkbox" v-model="isScriptEnabled" class="checkbox checkbox-primary" />
     <span class="label-text font-medium"
      >ゲームスクリプトを選択することで、使用できるプレースホルダーが増えます</span
     >
    </label>
   </SettingItem>

   <!-- スクリプト選択とパラメータ設定 -->
   <div v-if="isScriptEnabled" class="mt-6 space-y-4">
    <!-- スクリプト選択 -->
    <SettingItem
     label="ゲームスクリプト"
     :description="'ゲーム結果は、おみくじ設定＞プレースホルダー一覧で出力'"
     :showReset="false"
    >
     <select v-model="scriptId" class="select select-bordered w-full">
      <option value="">スクリプトを選択してください</option>
      <option v-for="(script, scriptId) in scriptGameMap" :key="scriptId" :value="scriptId">
       {{ scriptId }}
      </option>
     </select>
    </SettingItem>

    <!-- スクリプト設定パラメータ -->
    <div v-if="isScriptEnabled && selectedScript?.params?.length" class="space-y-4">
     <SettingItem
      v-for="setting in selectedScript.params"
      :key="setting.key"
      :label="setting.name"
      :description="setting.description"
      @reset="resetParam(setting.key, setting.defaultValue)"
     >
      <!-- 文字列入力 -->
      <input
       v-if="setting.inputType === 'string'"
       type="text"
       v-model="scriptParams[setting.key]"
       class="input input-bordered w-full"
       :placeholder="setting.description || ''"
      />

      <!-- 数値入力 -->
      <input
       v-else-if="setting.inputType === 'number'"
       type="number"
       v-model.number="scriptParams[setting.key]"
       :min="setting.min"
       :max="setting.max"
       class="input input-bordered w-full"
      />

      <!-- セレクト -->
      <select
       v-else-if="setting.inputType === 'select'"
       v-model="scriptParams[setting.key]"
       class="select select-bordered w-full"
      >
       <option v-for="(option, index) in setting.values" :key="index" :value="option">
        {{ option }}
       </option>
      </select>

      <!-- ブール値（チェックボックス） -->
      <div v-else-if="setting.inputType === 'boolean'" class="form-control">
       <label class="label cursor-pointer justify-start gap-3">
        <input
         type="checkbox"
         v-model="scriptParams[setting.key]"
         class="checkbox checkbox-primary"
        />
        <span class="label-text">有効</span>
       </label>
      </div>
     </SettingItem>
    </div>
    <div v-else class="text-base-content/60">
     このスクリプトには設定可能なパラメータがありません
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CommentRuleType, DefaultTypes, ScriptPreset, createScriptParamsSchema } from '@type/';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { Info } from 'lucide-vue-next';

const props = defineProps<{
 modelValue: CommentRuleType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CommentRuleType];
}>();

// スクリプト有効化フラグ
const isScriptEnabled = computed({
 get: () => props.modelValue.scriptId !== null,
 set: (enabled: boolean) => {
  if (enabled) {
   emit('update:modelValue', {
    ...props.modelValue,
    scriptId: '',
    scriptParams: {}
   });
  } else {
   emit('update:modelValue', {
    ...props.modelValue,
    scriptId: null,
    scriptParams: null
   });
  }
 }
});

// スクリプトID
const scriptId = computed({
 get: () => props.modelValue.scriptId || '',
 set: (newScriptId: string) => {
  const finalScriptId = newScriptId === '' ? null : newScriptId;
  let defaultParams: DefaultTypes = {};

  if (finalScriptId) {
   const schema = createScriptParamsSchema(finalScriptId, scriptGameMap);
   defaultParams = schema.parse({}) as DefaultTypes;
  }

  emit('update:modelValue', {
   ...props.modelValue,
   scriptId: finalScriptId,
   scriptParams: defaultParams
  });
 }
});

// 選択されたスクリプト
const selectedScript = computed((): ScriptPreset | null => {
 if (!props.modelValue.scriptId) return null;
 return scriptGameMap[props.modelValue.scriptId] || null;
});

// スクリプトパラメータの双方向バインディング
const scriptParams = computed({
 get: () => props.modelValue.scriptParams || {},
 set: (newParams: Record<string, any>) => {
  emit('update:modelValue', {
   ...props.modelValue,
   scriptParams: newParams
  });
 }
});

// パラメータリセット
const resetParam = (paramId: string, defaultValue: any) => {
 const currentParams = { ...scriptParams.value };
 currentParams[paramId] = defaultValue;
 scriptParams.value = currentParams;
};
</script>
