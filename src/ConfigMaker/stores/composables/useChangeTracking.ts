// src/ConfigMaker/script/stores/composables/useChangeTracking.ts
import { ref, computed, Ref } from 'vue';
import { OmikujiDataType } from '@/types/';

/**
 * データ変更追跡機能を提供するコンポーザブル
 */
export function useChangeTracking(data: Ref<OmikujiDataType>, initialData: OmikujiDataType) {
 const hasUnsavedChanges = ref<boolean>(false);
 const lastSavedDataHash = ref<string>('');

 /**
  * データのハッシュ値を計算
  */
 const calculateDataHash = (data: OmikujiDataType): string => {
  return JSON.stringify(data);
 };

 // 初期ハッシュ値の設定
 lastSavedDataHash.value = calculateDataHash(initialData);

 /**
  * データが変更されているかを判定
  */
 const isDataChanged = computed(() => {
  console.log(hasUnsavedChanges.value);
  return hasUnsavedChanges.value || calculateDataHash(data.value) !== lastSavedDataHash.value;
 });

 /**
  * データが変更されたことをマーク
  */
 const markAsChanged = () => {
  hasUnsavedChanges.value = true;
 };

 /**
  * データが保存されたことをマーク
  */
 const markAsSaved = () => {
  hasUnsavedChanges.value = false;
  lastSavedDataHash.value = calculateDataHash(data.value);
 };

 return {
  hasUnsavedChanges,
  isDataChanged,
  markAsChanged,
  markAsSaved
 };
}
