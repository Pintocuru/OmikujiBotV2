// src/ConfigMaker/script/stores/composables/useRecordOperations.ts
import { Ref } from 'vue';
import { CategoryType, OmikujiDataType, RecordCategoryType, RecordCategoryTypeMap } from '@/types/';

/**
 * カテゴリ内のアイテム操作機能を提供するコンポーザブル
 */
export function useRecordOperations(data: Ref<OmikujiDataType>, markAsChanged: () => void) {
 /**
  * カテゴリ全体のデータを更新
  */
 const updateCategoryData = <C extends CategoryType>(
  category: C,
  newData: Record<string, OmikujiDataType[C]>
 ) => {
  data.value[category] = newData as OmikujiDataType[C];
  markAsChanged();
 };

 /**
  * カテゴリに新しいアイテムを追加
  */
 const addItem = <T>(category: CategoryType, id: string, item: T) => {
  const currentCategory = (data.value[category] || {}) as Record<string, T>;
  data.value[category] = { ...currentCategory, [id]: item } as any;

  markAsChanged();
 };

 /**
  * カテゴリ内のアイテムを更新（存在しない場合は追加）
  */
 const updateItem = <T>(category: CategoryType, id: string, updates: Partial<T>) => {
  console.log('updateItem');
  const categoryData = data.value[category] as Record<string, T>;

  if (categoryData && categoryData[id] !== undefined) {
   const updatedItem = { ...categoryData[id], ...updates };
   const updatedCategory = { ...categoryData, [id]: updatedItem };
   data.value[category] = updatedCategory as any;

   markAsChanged();
  } else {
   addItem(category, id, updates as T);
  }
 };

 /**
  * カテゴリからアイテムを削除
  */
 const removeItem = (category: CategoryType, id: string) => {
  const categoryData = data.value[category] as Record<string, any>;
  console.log('removeItem');

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

 /**
  * カテゴリ内のアイテムを複製
  */
 const duplicateItem = <T extends { id: string }>(
  category: CategoryType,
  id: string
 ): string | null => {
  const item = getItemFromCategory<T>(category, id);
  if (!item) return null;

  const newId = `${id}_copy`;
  const duplicatedItem: T = { ...item, id: newId };

  addItem(category, newId, duplicatedItem);
  return newId;
 };

 /**
  * RecordCategoryのプロパティを更新
  */
 const updateRuleNestedProperty = <
  C extends RecordCategoryType,
  K extends keyof RecordCategoryTypeMap[C]
 >(
  category: C,
  id: string,
  key: K,
  value: RecordCategoryTypeMap[C][K]
 ) => {
  const currentCategory = data.value[category] as Record<string, RecordCategoryTypeMap[C]>;
  if (currentCategory[id]) {
   const updatedRule = { ...currentCategory[id], [key]: value };
   const updatedCategory = { ...currentCategory, [id]: updatedRule };
   updateCategoryData(category, updatedCategory as Record<string, OmikujiDataType[C]>);
  }
 };

 /**
  * カテゴリから特定のアイテムを取得
  */
 const getItemFromCategory = <T>(category: CategoryType, id: string): T | undefined => {
  return (data.value[category] as Record<string, T>)?.[id];
 };

 /**
  * カテゴリの全アイテムを取得
  */
 const getCategoryItems = <T>(category: CategoryType): Record<string, T> => {
  return (data.value[category] as Record<string, T>) || {};
 };

 return {
  updateCategoryData,
  addItem,
  updateItem,
  removeItem,
  duplicateItem,
  updateRuleNestedProperty,
  getItemFromCategory,
  getCategoryItems
 };
}
