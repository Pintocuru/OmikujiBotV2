// src/ConfigMaker/script/useOmikujiStore.ts
import { ref, computed } from 'vue';
import {
 CategoryType,
 OmikujiDataSchema,
 OmikujiDataType,
 SelectCategoryType,
 selectCategoryType,
 RuleType,
 CommentRuleType,
 TimerRuleType,
 PlaceholderType,
 CharacterType
} from '@/types/';
import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';
import { ImportMode, ImportPreview } from '../components/presets/useImportPreviewManager';

type CategoryTypeMap = {
 comments: CommentRuleType;
 timers: TimerRuleType;
 placeholders: PlaceholderType;
 characters: CharacterType;
};

// omikujiData
const omikujiData = OmikujiDataSchema.parse(window.omikujiData);

export const useOmikujiStore = defineStore('omikuji', () => {
 // Core data
 const data = ref<OmikujiDataType>(omikujiData);

 // 変更追跡用の状態
 const hasUnsavedChanges = ref<boolean>(false);
 const lastSavedDataHash = ref<string>('');

 // データのハッシュ値を計算する関数
 const calculateDataHash = (data: OmikujiDataType): string => {
  return JSON.stringify(data);
 };

 // 初期化時のハッシュ値を保存
 lastSavedDataHash.value = calculateDataHash(omikujiData);

 // 変更があったかどうかを判定するcomputed
 const isDataChanged = computed(() => {
  return hasUnsavedChanges.value || calculateDataHash(data.value) !== lastSavedDataHash.value;
 });

 // データが変更されたことをマークする関数
 const markAsChanged = () => {
  hasUnsavedChanges.value = true;
 };

 // データが保存されたことをマークする関数
 const markAsSaved = () => {
  hasUnsavedChanges.value = false;
  lastSavedDataHash.value = calculateDataHash(data.value);
 };

 // Navigation state
 const selectedCategory = ref<CategoryType>('comments');
 const selectedRuleId = ref<string | null>(null);

 // Data operations
 const loadData = (loadData: unknown): boolean => {
  try {
   const parsed = OmikujiDataSchema.safeParse(loadData);
   if (parsed.success) {
    data.value = parsed.data;
    // データロード時は保存済みとしてマーク
    markAsSaved();
    toast.success('データを正常に読み込みました。');
    return true;
   } else {
    toast.error('データの形式が正しくありません。');
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
   markAsSaved();
   return JSON.stringify(data.value, null, 2);
  }
  throw new Error('データの検証に失敗しました。');
 };

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
   // マージ時は変更としてマーク
   markAsChanged();
   toast.success('データのマージが完了しました。');
   return true;
  } catch (error) {
   toast.error('データのマージ中にエラーが発生しました。');
   console.error('Merge error:', error);
   return false;
  }
 };

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

 const updateData = (newData: OmikujiDataType) => {
  data.value = newData;
  markAsChanged();
 };

 // 💡 修正: data.value全体を更新するのではなく、対象のカテゴリだけを新しいオブジェクトに置き換える
 const updateCategoryData = <C extends CategoryType>(
  category: C,
  newData: Record<string, OmikujiDataType[C]>
 ) => {
  data.value[category] = newData as any;
  markAsChanged();
 };

 const updateRuleNestedProperty = <
  C extends SelectCategoryType,
  K extends keyof CategoryTypeMap[C]
 >(
  category: C,
  id: string,
  key: K,
  value: CategoryTypeMap[C][K]
 ) => {
  const currentCategory = data.value[category] as Record<string, CategoryTypeMap[C]>;
  if (currentCategory[id]) {
   const updatedRule = { ...currentCategory[id], [key]: value };
   const updatedCategory = { ...currentCategory, [id]: updatedRule };
   // 修正: updatedCategoryを明示的に正しい型にキャスト
   updateCategoryData(category, updatedCategory as Record<string, OmikujiDataType[C]>);
  }
 };

 // Category operations
 const addItemToCategory = <T>(category: CategoryType, id: string, item: T) => {
  // 💡 修正: オブジェクトのプロパティを直接変更
  const currentCategory = (data.value[category] || {}) as Record<string, T>;
  data.value[category] = { ...currentCategory, [id]: item } as any;
  markAsChanged();
  console.log('addItemToCategory 実行後の data:', JSON.stringify(data.value, null, 2));
 };

 // 💡 修正: updateCategoryDataを介さず、直接データを更新
 const updateItemInCategory = <T>(category: CategoryType, id: string, updates: Partial<T>) => {
  console.log('updateItemInCategory');
  const categoryData = data.value[category] as Record<string, T>;
  if (categoryData && categoryData[id] !== undefined) {
   const updatedItem = { ...categoryData[id], ...updates };
   const updatedCategory = { ...categoryData, [id]: updatedItem };
   data.value[category] = updatedCategory as any;
   markAsChanged();
  } else {
   addItemToCategory(category, id, updates as T);
  }
 };

 const removeItemFromCategory = (category: CategoryType, id: string) => {
  const categoryData = data.value[category] as Record<string, any>;
  console.log('updateItemInCategory');
  if (categoryData && categoryData[id] !== undefined) {
   const updatedCategory = Object.fromEntries(
    Object.entries(categoryData).filter(([key]) => key !== id)
   );
   updateCategoryData(
    category,
    updatedCategory as Record<string, OmikujiDataType[typeof category]>
   );
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

  if (!selectCategoryType.includes(category as SelectCategoryType)) {
   selectedRuleId.value = null;
   return;
  }

  const items = getCategoryItems<any>(category);
  const firstId =
   Object.entries(items)
    .filter(([_, item]) => typeof item.order === 'number')
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
  data,
  selectedCategory,
  selectedRuleId,
  isDataChanged,
  hasUnsavedChanges,
  markAsChanged,
  markAsSaved,
  loadData,
  validateData,
  exportData,
  mergeDataSets,
  mergeCategoryData,

  // 修正済みメソッド
  addItemToCategory,
  updateItemInCategory,
  removeItemFromCategory,
  duplicateItemInCategory,
  updateRuleNestedProperty,
  updateCategoryData,

  // Helper
  getItemFromCategory,
  getCategoryItems,

  // Navigation
  selectCategory,
  selectRule,
  clearSelection
 };
});
