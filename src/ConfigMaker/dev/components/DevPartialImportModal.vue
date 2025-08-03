<!-- src/configMaker/dev/components/DevPartialImportModal.vue -->
<template>
 <div class="modal modal-open">
  <div class="modal-box max-w-2xl">
   <h3 class="font-bold text-lg mb-4">部分設定読み込み</h3>

   <div v-if="isLoading" class="text-center py-8">
    <span class="loading loading-spinner loading-md"></span>
    <p class="mt-2">設定ファイルを読み込み中...</p>
   </div>

   <div v-else-if="error" class="text-center py-8">
    <div class="text-error mb-2">エラーが発生しました</div>
    <p class="text-sm">{{ error }}</p>
   </div>

   <div v-else-if="previewData" class="space-y-4">
    <p class="text-sm opacity-70">読み込む設定カテゴリと読み込み方法を選択してください</p>

    <!-- 読み込み方法選択 -->
    <div class="form-control">
     <label class="label">
      <span class="label-text font-medium">読み込み方法</span>
     </label>
     <div class="flex gap-4">
      <label class="cursor-pointer label">
       <input type="radio" v-model="importMode" value="replace" class="radio radio-sm" />
       <span class="label-text ml-2">置き換え</span>
      </label>
      <label class="cursor-pointer label">
       <input type="radio" v-model="importMode" value="merge" class="radio radio-sm" />
       <span class="label-text ml-2">マージ（既存データと統合）</span>
      </label>
     </div>
     <label class="label">
      <span class="label-text-alt opacity-70">
       {{
        importMode === 'replace'
         ? '選択したカテゴリのデータを完全に置き換えます'
         : '同じキーの場合は新しいデータを優先して統合します'
       }}
      </span>
     </label>
    </div>

    <div class="space-y-2 max-h-64 overflow-y-auto">
     <div
      v-for="category in availableCategories"
      :key="category.type"
      class="flex items-center justify-between p-3 bg-base-200 rounded"
     >
      <div class="flex items-center gap-3">
       <input
        type="checkbox"
        :id="`category-${category.type}`"
        v-model="selectedCategories"
        :value="category.type"
        class="checkbox checkbox-sm"
       />
       <label :for="`category-${category.type}`" class="flex-1 cursor-pointer">
        <div class="font-medium">
         {{ category.name }}
         <span class="text-sm pl-2"
          >({{
           category.type === 'scriptSettings'
            ? '置き換えのみ'
            : category.type === 'displaySettings'
              ? '置き換えのみ'
              : category.type === 'wordPartySettings'
                ? '置き換えのみ'
                : 'マージ / 置き換え'
          }})</span
         >
        </div>
        <div class="text-xs opacity-70">{{ category.description }}</div>
       </label>
      </div>

      <div class="text-xs">{{ category.itemCount }}件</div>
     </div>
    </div>

    <div class="modal-action">
     <button class="btn btn-ghost" @click="$emit('close')">キャンセル</button>
     <button
      class="btn btn-primary"
      @click="executeImport"
      :disabled="selectedCategories.length === 0"
     >
      {{ importMode === 'replace' ? '置き換え' : 'マージ' }} ({{
       selectedCategories.length
      }}カテゴリ)
     </button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
 categoryLabels,
 CategoryType,
 OmikujiDataType,
 selectCategoryType,
 SelectCategoryType
} from '@type/';
import { useDevStore } from '@/ConfigMaker/dev/stores/useDevStore';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';

interface CategoryInfo {
 type: CategoryType;
 name: string;
 description: string;
 itemCount: number;
}

const props = defineProps<{
 fileName: string;
}>();
const emit = defineEmits(['close', 'import']);

// fetchFileData
const devStore = useDevStore();
const omikujiStore = useOmikujiStore();

const isLoading = ref(true);
const error = ref('');
const previewData = ref<any>(null);
const selectedCategories = ref<CategoryType[]>([]);
const importMode = ref<'replace' | 'merge'>('replace'); // デフォルトは置き換え

// 利用可能なカテゴリ情報
const availableCategories = computed<CategoryInfo[]>(() => {
 if (!previewData.value) return [];

 const categories: CategoryInfo[] = Object.entries(categoryLabels).map(
  ([type, { label, description }]) => ({
   type: type as CategoryType,
   name: label,
   description,
   itemCount: 0
  })
 );

 // 各カテゴリのアイテム数を計算
 categories.forEach((category) => {
  const data = previewData.value[category.type];
  if (Array.isArray(data)) {
   category.itemCount = data.length;
  } else if (data && typeof data === 'object') {
   category.itemCount = Object.keys(data).length;
  }
 });

 // アイテムが存在するカテゴリのみ返す
 return categories.filter((category) => category.itemCount > 0);
});

// ファイルデータを読み込み
onMounted(async () => {
 try {
  const fileData = await devStore.fetchFileData(props.fileName);
  previewData.value = fileData;

  // デフォルトで全カテゴリを選択
  selectedCategories.value = availableCategories.value.map((cat) => cat.type);
 } catch (err) {
  error.value = err instanceof Error ? err.message : '設定ファイルの読み込みに失敗しました';
 } finally {
  isLoading.value = false;
 }
});

// カテゴリ別マージ関数
const mergeCategory = (categoryType: CategoryType, currentData: any, newData: any): any => {
 // selectCategoryType（comments, timers, placeholders, characters）は深いマージ
 if (selectCategoryType.includes(categoryType as SelectCategoryType)) {
  const result = { ...currentData };
  for (const key in newData) {
   if (newData.hasOwnProperty(key)) {
    result[key] = newData[key]; // 同じキーの場合は新しいデータを優先
   }
  }
  return result;
 }

 // その他（scriptSettings, displaySettings, wordPartySettings）は置き換え
 return newData;
};

// インポート実行
const executeImport = () => {
 if (!previewData.value || selectedCategories.value.length === 0) return;

 const currentData = { ...omikujiStore.data };
 const importData: Partial<OmikujiDataType> = {};

 selectedCategories.value.forEach((categoryType) => {
  if (previewData.value[categoryType]) {
   if (importMode.value === 'merge' && currentData[categoryType]) {
    // マージモード：カテゴリ別のマージ処理
    importData[categoryType] = mergeCategory(
     categoryType,
     currentData[categoryType],
     previewData.value[categoryType]
    );
   } else {
    // 置き換えモード：新データで置き換え
    importData[categoryType] = previewData.value[categoryType];
   }
  }
 });

 // 現在のデータとマージ
 const finalData = { ...currentData, ...importData };

 emit('import', { data: finalData, mode: importMode.value });
};
</script>
