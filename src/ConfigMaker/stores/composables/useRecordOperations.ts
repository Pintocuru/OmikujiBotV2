// src/ConfigMaker/script/stores/composables/useRecordOperations.ts
import { Ref } from 'vue';
import {
 categorySchemaMap,
 CategoryType,
 OmikujiDataType,
 RecordCategoryType,
 RecordCategoryTypeMap
} from '@/types/';

// categorySchemaMapの型安全性を向上
interface TypedSchema<T> {
 parse(input: unknown): T & { id: string };
}
const typedCategorySchemaMap: {
 [K in RecordCategoryType]: TypedSchema<RecordCategoryTypeMap[K]>;
} = categorySchemaMap as any;

/**
 * カテゴリ内のアイテム操作機能を提供するコンポーザブル
 */
export function useRecordOperations(data: Ref<OmikujiDataType>) {
 /**
  * カテゴリ全体のデータを更新
  */
 const updateCategoryData = <C extends CategoryType>(
  category: C,
  newData: Record<string, OmikujiDataType[C]>
 ) => {
  data.value[category] = newData as OmikujiDataType[C];
 };

 /**
  * カテゴリに新しいアイテムを追加
  */
 const addItem = <C extends RecordCategoryType>(
  category: C,
  item: Partial<RecordCategoryTypeMap[C]>
 ) => {
  const schema = typedCategorySchemaMap[category];
  let parseItem = item;

  // 重複check
  if (typeof parseItem.id === 'string' && data.value[category][parseItem.id]) {
   parseItem = { ...parseItem, id: undefined };
  }

  const newItem = schema.parse(parseItem);
  const id = newItem.id;

  data.value[category] = { ...data.value[category], [id]: newItem };
 };

 /**
  * カテゴリ内のアイテムを更新（存在しない場合は追加）
  */
 const updateItem = <C extends RecordCategoryType>(
  category: C,
  id: string,
  updates: Partial<RecordCategoryTypeMap[C]>
 ) => {
  const categoryData = data.value[category] as Record<string, RecordCategoryTypeMap[C]>;

  if (categoryData && categoryData[id] !== undefined) {
   const updatedItem = { ...categoryData[id], ...updates };
   const updatedCategory = { ...categoryData, [id]: updatedItem };
   data.value[category] = updatedCategory as any;
  } else {
   addItem(category, updates);
  }
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
  * カテゴリからアイテムを削除
  */
 const removeItem = (category: RecordCategoryType, id: string) => {
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
 const duplicateItem = <C extends RecordCategoryType>(category: C, id: string): string | null => {
  const item = getItem<RecordCategoryTypeMap[C]>(category, id);
  if (!item) return null;

  const newId = `${id}_copy`;
  const duplicatedItem = { ...item, id: newId };

  // 型が一致するようになった
  addItem(category, duplicatedItem);
  return newId;
 };

 /**
  * カテゴリから特定のアイテムを取得
  */
 const getItem = <T>(category: RecordCategoryType, id: string): T | undefined => {
  return (data.value[category] as Record<string, T>)?.[id];
 };

 /**
  * カテゴリの全アイテムを取得
  */
 const getCategoryMap = <T>(category: RecordCategoryType): Record<string, T> => {
  return (data.value[category] as Record<string, T>) || {};
 };

 const getCategoryArray = <T>(category: RecordCategoryType): T[] => {
  return Object.values(data.value[category]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
 };

 return {
  updateCategoryData,
  addItem,
  updateItem,
  removeItem,
  duplicateItem,
  updateRuleNestedProperty,
  getItem,
  getCategoryMap,
  getCategoryArray
 };
}
