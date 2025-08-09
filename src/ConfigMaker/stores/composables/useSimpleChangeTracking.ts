// src/ConfigMaker/script/stores/composables/useSimpleChangeTracking.ts
// ! 削除予定
import { ref } from 'vue';

/**
 * シンプルな変更追跡（明示的操作ベース）
 */
export function useSimpleChangeTracking() {
 // boolではなく数値で更新を見る
 const checkCount = ref<number>(0);
 return {
  checkCount,
  // 変更をマーク
  markAsChanged: () => checkCount.value++,
  // 保存済みとしてマーク
  markAsSaved: () => (checkCount.value = 0)
 };
}
