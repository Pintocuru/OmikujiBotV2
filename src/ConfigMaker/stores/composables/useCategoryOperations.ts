// src/ConfigMaker/script/stores/composables/useCategoryOperations.ts
import { Ref } from 'vue';
import { CategoryType, OmikujiDataType, SelectCategoryType, SelectCategoryTypeMap } from '@/types/';

/**
 * カテゴリ内のアイテム操作機能を提供するコンポーザブル
 */
export function useCategoryOperations(
 data: Ref<OmikujiDataType>,
 markAsChanged: (operation?: string) => void
) {
 /**
  * カテゴリ全体のデータを更新
  */
 const updateCategoryData = <C extends CategoryType>(
  category: C,
  newData: Record<string, OmikujiDataType[C]>
 ) => {
  data.value[category] = newData as OmikujiDataType[C];
  markAsChanged(`updateCategoryData: ${category}`);
 };

 /**
  * カテゴリに新しいアイテムを追加
  */
 const addItemToCategory = <T>(category: CategoryType, id: string, item: T) => {
  const currentCategory = (data.value[category] || {}) as Record<string, T>;
  data.value[category] = { ...currentCategory, [id]: item } as any;

  markAsChanged(`addItemToCategory: ${category}/${id}`);
 };

 /**
  * カテゴリ内のアイテムを更新（存在しない場合は追加）
  */
 const updateItemInCategory = <T>(category: CategoryType, id: string, updates: Partial<T>) => {
  console.log('updateItemInCategory');
  const categoryData = data.value[category] as Record<string, T>;

  if (categoryData && categoryData[id] !== undefined) {
   const updatedItem = { ...categoryData[id], ...updates };
   const updatedCategory = { ...categoryData, [id]: updatedItem };
   data.value[category] = updatedCategory as any;

   markAsChanged(`updateItemInCategory: ${category}/${id}`);
  } else {
   addItemToCategory(category, id, updates as T);
  }
 };

 /**
  * カテゴリからアイテムを削除
  */
 const removeItemFromCategory = (category: CategoryType, id: string) => {
  const categoryData = data.value[category] as Record<string, any>;
  console.log('removeItemFromCategory');

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
 const duplicateItemInCategory = <T extends { id: string }>(
  category: CategoryType,
  id: string
 ): string | null => {
  const item = getItemFromCategory<T>(category, id);
  if (!item) return null;

  const newId = `${id}_copy`;

  // 💡 修正: オブジェクト内のidプロパティも新しいIDに更新
  const duplicatedItem: T = {
   ...item,
   id: newId // idフィールドを新しいIDで上書き
  };

  addItemToCategory(category, newId, duplicatedItem);
  return newId;
 };

 /**
  * ルールのネストしたプロパティを更新
  */
 const updateRuleNestedProperty = <
  C extends SelectCategoryType,
  K extends keyof SelectCategoryTypeMap[C]
 >(
  category: C,
  id: string,
  key: K,
  value: SelectCategoryTypeMap[C][K]
 ) => {
  const currentCategory = data.value[category] as Record<string, SelectCategoryTypeMap[C]>;
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
  addItemToCategory,
  updateItemInCategory,
  removeItemFromCategory,
  duplicateItemInCategory,
  updateRuleNestedProperty,
  getItemFromCategory,
  getCategoryItems
 };
}
