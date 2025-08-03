// src/ConfigMaker/script/useOmikujiStore.ts
import { ref } from 'vue';
import {
 CategoryType,
 OmikujiDataSchema,
 OmikujiDataType,
 SelectCategoryType,
 selectCategoryType
} from '@/types/';
import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';
import { ImportMode, ImportPreview } from '../components/presets/useImportPreviewManager';

// omikujiData
const omikujiData = OmikujiDataSchema.parse(window.omikujiData);

export const useOmikujiStore = defineStore('omikuji', () => {
 // Core data
 const data = ref<OmikujiDataType>(omikujiData);

 // Navigation state
 const selectedCategory = ref<CategoryType>('comments');
 const selectedRuleId = ref<string | null>(null);

 // Data operations
 const loadData = (loadData: unknown): boolean => {
  try {
   const parsed = OmikujiDataSchema.safeParse(loadData);
   if (parsed.success) {
    data.value = parsed.data;
    toast.success('データを正常に読み込みました。');
    return true;
   } else {
    toast.error('データの形式が正しくありません。');
    // デバッグ用にエラーをコンソールに出力
    console.error('Validation errors:', parsed.error);
    return false;
   }
  } catch (error) {
   toast.error('データの読み込み中にエラーが発生しました。');
   console.error('Load data error:', error);
   return false;
  }
 };

 const validateData = () => {
  return OmikujiDataSchema.safeParse(data.value);
 };

 const exportData = () => {
  const validation = validateData();
  if (validation.success) {
   return JSON.stringify(data.value, null, 2);
  }
  throw new Error('データの検証に失敗しました。');
 };

 // データのマージ処理（useDataMergerから移動）
 const mergeDataSets = (importedData: OmikujiDataType, preview: ImportPreview): boolean => {
  try {
   const result: OmikujiDataType = { ...data.value };

   Object.entries(preview.categories).forEach(([categoryKey, config]) => {
    if (!config.enabled) return;

    const category = categoryKey as CategoryType;

    const currentItems = result[category] as Record<string, unknown>;
    const importItems = importedData[category] as Record<string, unknown>;

    const mergedItems = mergeCategoryData(currentItems, importItems, config.mode);
    result[category] = mergedItems as any;
   });

   // データを更新
   data.value = result;
   toast.success('データのマージが完了しました。');
   return true;
  } catch (error) {
   toast.error('データのマージ中にエラーが発生しました。');
   console.error('Merge error:', error);
   return false;
  }
 };

 // カテゴリ単位でのマージ（useDataMergerから移動）
 const mergeCategoryData = (
  currentItems: Record<string, unknown>,
  importItems: Record<string, unknown>,
  mode: ImportMode
 ): Record<string, unknown> => {
  switch (mode) {
   case 'replace':
    return importItems;
   case 'merge':
    return { ...currentItems, ...importItems };
   case 'add-only':
    const result = { ...currentItems };
    Object.entries(importItems).forEach(([key, value]) => {
     if (!(key in currentItems)) {
      result[key] = value;
     }
    });
    return result;
  }
 };

 // Category operations
 const addItemToCategory = <T>(category: CategoryType, id: string, item: T) => {
  if (!data.value[category]) {
   data.value[category] = {} as any;
  }
  (data.value[category] as Record<string, T>)[id] = item;
 };

 const updateItemInCategory = <T>(category: CategoryType, id: string, item: T) => {
  if (data.value[category] && (data.value[category] as Record<string, T>)[id] !== undefined) {
   (data.value[category] as Record<string, T>)[id] = item;
  } else {
   addItemToCategory(category, id, item);
  }
 };

 const removeItemFromCategory = (category: CategoryType, id: string) => {
  if (data.value[category] && (data.value[category] as Record<string, any>)[id] !== undefined) {
   delete (data.value[category] as Record<string, any>)[id];
  }
 };

 const getItemFromCategory = <T>(category: CategoryType, id: string): T | undefined => {
  return (data.value[category] as Record<string, T>)?.[id];
 };

 const getCategoryItems = <T>(category: CategoryType): Record<string, T> => {
  return (data.value[category] as Record<string, T>) || {};
 };

 const duplicateItemInCategory = <T>(category: CategoryType, id: string): string | null => {
  const item = getItemFromCategory<T>(category, id);
  if (!item) return null;

  const newId = `${id}_copy_${Date.now()}`;
  addItemToCategory(category, newId, { ...item } as T);
  return newId;
 };

 // Navigation
 const selectCategory = (category: CategoryType) => {
  selectedCategory.value = category;

  // 選択不要カテゴリなら selectedRuleId を null にして終了
  if (!selectCategoryType.includes(category as SelectCategoryType)) {
   selectedRuleId.value = null;
   return;
  }

  const items = getCategoryItems<any>(category);
  const firstId =
   Object.entries(items)
    .filter(([_, item]) => typeof item.order === 'number') // item は object である前提
    .sort((a, b) => a[1].order - b[1].order)[0]?.[0] ??
   Object.keys(items)[0] ??
   null;

  selectedRuleId.value = firstId;
 };

 const selectRule = (id: string) => {
  selectedRuleId.value = id;
 };

 const clearSelection = () => {
  selectedRuleId.value = null;
 };

 return {
  // データ
  data,

  // ナビゲーション状態
  selectedCategory,
  selectedRuleId,

  // データ操作メソッド
  loadData,
  validateData,
  exportData,
  mergeDataSets,
  mergeCategoryData,

  // カテゴリ操作メソッド
  addItemToCategory,
  updateItemInCategory,
  removeItemFromCategory,
  getItemFromCategory,
  getCategoryItems,
  duplicateItemInCategory,

  // ナビゲーション
  selectCategory,
  selectRule,
  clearSelection
 };
});
