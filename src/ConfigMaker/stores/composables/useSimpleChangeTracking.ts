// src/ConfigMaker/script/stores/composables/useSimpleChangeTracking.ts
import { computed, ref } from 'vue';

/**
 * シンプルな変更追跡（明示的操作ベース）
 */
export function useSimpleChangeTracking() {
 const hasUnsavedChanges = ref<boolean>(false);
 const changeOperations = ref<string[]>([]); // デバッグ用：何の操作が行われたかを記録
 const isChanges = computed(() => changeOperations.value.length > 0);

 /**
  * 変更をマーク（操作名も記録）
  */
 const markAsChanged = (operation = 'unknown') => {
  hasUnsavedChanges.value = true;
  changeOperations.value.push(`${new Date().toLocaleTimeString()}: ${operation}`);
 };

 /**
  * 保存済みとしてマーク
  */
 const markAsSaved = () => {
  hasUnsavedChanges.value = false;
  changeOperations.value = [];
 };

 /**
  * 強制的に変更状態にする（緊急時用）
  */
 const forceChanged = () => {
  hasUnsavedChanges.value = true;
  markAsChanged('force_changed');
 };

 return {
  hasUnsavedChanges,
  isChanges,
  changeOperations,
  markAsChanged,
  markAsSaved,
  forceChanged
 };
}
