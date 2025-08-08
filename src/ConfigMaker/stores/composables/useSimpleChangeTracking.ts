// src/ConfigMaker/script/stores/composables/useSimpleChangeTracking.ts
// ! 削除予定
import { ref } from 'vue';

/**
 * シンプルな変更追跡（明示的操作ベース）
 */
export function useSimpleChangeTracking() {
 // boolではなく配列の長さで更新を見る
 const changeOperations = ref<string[]>([]);
 // boolではなく数値で更新を見る
 const checkCount = ref<number>(0);

 /**
  * 変更をマーク（操作名も記録）
  */
 const markAsChanged = (operation = 'unknown') => {
  checkCount.value++;
  changeOperations.value.push(`${new Date().toLocaleTimeString()}: ${operation}`);
 };

 /**
  * 保存済みとしてマーク
  */
 const markAsSaved = () => {
  //changeOperations.value = [];
  checkCount.value = 0;
 };

 return {
  checkCount,
  changeOperations,
  markAsChanged,
  markAsSaved
 };
}
