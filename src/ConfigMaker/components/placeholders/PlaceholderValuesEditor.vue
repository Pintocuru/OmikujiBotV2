<!-- src/configMaker/components/placeholders/PlaceholderValuesEditor.vue -->
<template>
 <div class="space-y-4">
  <!-- 編集モード切り替えボタン -->
  <div class="flex justify-end">
   <button
    @click="toggleEditMode"
    class="btn btn-sm bg-secondary"
    :class="{ 'btn-active': isTextMode }"
    title="編集モードを切り替え"
   >
    {{ isTextMode ? '🔧 入力モード' : '📝 テキストモード' }}
   </button>
  </div>

  <!-- 入力モード -->
  <div v-if="!isTextMode" class="space-y-1">
   <div v-for="(value, index) in localValues" :key="index" class="card bg-base-100 p-2">
    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
     <!-- 重み -->
     <input
      type="number"
      v-model.number="value.weight"
      min="0"
      class="input input-bordered input-sm w-full sm:w-24 mb-2 sm:mb-0"
      placeholder="重み"
     />

     <!-- 内容 -->
     <input
      type="text"
      v-model="value.content"
      placeholder="プレースホルダーの内容"
      class="input input-bordered input-sm w-full"
     />

     <!-- 複製・削除ボタン -->
     <div class="mt-2 sm:mt-0 sm:ml-auto">
      <MenuDropdown
       :disableDelete="localValues.length <= 1"
       @duplicate="duplicateValue(index)"
       @delete="removeValue(index)"
      />
     </div>
    </div>
   </div>

   <button @click="addValue" class="btn btn-primary btn-sm w-full">+ 値を追加</button>
  </div>

  <!-- テキストモード -->
  <div v-else>
   <!-- 入力形式の説明 -->
   <div class="alert alert-info">
    <span class="text-2xl">ℹ️</span>
    <div class="text-sm">
     <div class="font-semibold mb-1">入力形式:</div>
     <div>• 各行が1つの項目になります</div>
     <div>• 形式: <code class="bg-accent px-1 rounded">重み,内容</code></div>
     <div>
      • 例: <code class="bg-accent px-1 rounded">3,テキスト</code> または
      <code class="bg-accent px-1 rounded">テキスト</code>（数値がない場合、重み1として扱います）
     </div>
     <div class="text-xs text-gray-500 mt-1">※ 重みは1以上の整数で指定してください</div>
    </div>
   </div>

   <!-- テキストエリア -->
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">📝 テキスト入力</span>
     <span class="label-text-alt">{{ lineCount }}行</span>
    </label>
    <textarea
     v-model="textContent"
     class="textarea textarea-bordered h-64 font-mono text-sm resize-none w-full"
     placeholder="3,重要な内容&#10;1,普通の内容&#10;5,とても重要な内容&#10;単純なテキスト（重み1）"
     @input="updateLineCount"
    />
   </div>

   <!-- エラーサマリー -->
   <div v-if="hasErrors" class="alert alert-error">
    <span class="text-lg">⚠️</span>
    <div>
     <div class="font-semibold">入力エラーがあります</div>
     <div class="text-sm">{{ errorCount }}行にエラーがあります。修正してから保存してください。</div>
    </div>
   </div>

   <!-- 保存ボタン（直接編集版のみ） -->
   <div v-if="!isModal">
    <ModalFooterActions
     :on-cancel="handleCancelTextMode"
     :on-save="saveTextContent"
     :disabled="hasErrors || validItemsCount === 0"
     saveName="💾 保存"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PlaceholderValueType } from '@/types/';
import { usePlaceholderValues } from './usePlaceholderValues';
import { useTextModeParser } from './useTextModeParser';
import { usePlaceholderStore } from '@ConfigStore/usePlaceholderStore';
import MenuDropdown from '@ConfigComponents/parts/MenuDropdown.vue';
import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue';

const props = defineProps<{
 placeholderId: string;
 isModal?: boolean;
 showNameEdit?: boolean;
}>();

const emit = defineEmits<{
 valuesChanged: [values: Array<PlaceholderValueType>];
 nameChanged: [name: string];
}>();

const placeholderStore = usePlaceholderStore();

// コンポーザブルの使用
const { localValues, placeholderName, initializeValues, addValue, removeValue, duplicateValue } =
 usePlaceholderValues(props.placeholderId, props.isModal);

const {
 textContent,
 lineCount,
 hasErrors,
 validItemsCount,
 errorCount,
 updateLineCount,
 convertValuesToText,
 convertTextToValues
} = useTextModeParser();

// リアクティブデータ
const isTextMode = ref(false);

// 編集モード切り替え
const toggleEditMode = () => {
 if (!isTextMode.value) {
  // 入力モードからテキストモードへ
  convertValuesToText(localValues.value);
 } else {
  // テキストモードから入力モードへ
  if (!hasErrors.value && validItemsCount.value > 0) {
   localValues.value = convertTextToValues();
  }
 }
 isTextMode.value = !isTextMode.value;
};

// 保存可能かどうか
const canSave = computed(() => {
 if (isTextMode.value) {
  return !hasErrors.value && validItemsCount.value > 0;
 } else {
  return localValues.value.length > 0;
 }
});

// テキストコンテンツの保存（直接編集版のみ）
const saveTextContent = () => {
 if (hasErrors.value || validItemsCount.value === 0) return;

 const newValues = convertTextToValues();
 const success = placeholderStore.updatePlaceholderValues(props.placeholderId, newValues);

 if (!success) {
  console.error(`Failed to update placeholder values for ID: ${props.placeholderId}`);
 } else {
  toggleEditMode();
 }
};

// キャンセル時の処理（テキストモードから入力モードへ戻る）
const handleCancelTextMode = () => {
 isTextMode.value = false;
};

// 現在の値を取得（モーダル版で使用）
const getCurrentValues = () => {
 if (isTextMode.value) {
  if (hasErrors.value || validItemsCount.value === 0) return null;
  return convertTextToValues();
 } else {
  return localValues.value.length > 0 ? localValues.value : null;
 }
};

// 監視
watch(textContent, updateLineCount);

// 名前の変更を監視
watch(placeholderName, (newName) => {
 if (props.showNameEdit) {
  emit('nameChanged', newName);
 }
});

// 外部からアクセス可能な関数
defineExpose({
 initializeValues,
 getCurrentValues,
 canSave,
 placeholderName
});

// 初期化
initializeValues();
</script>
