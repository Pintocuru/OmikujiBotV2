// src/ConfigMaker/script/stores/composables/useChangeTracking.ts
import { ref, computed, Ref, watch, nextTick } from 'vue';
import { OmikujiDataType } from '@/types/';

/**
 * データ変更追跡機能を提供するコンポーザブル（修正版）
 */
export function useChangeTracking(data: Ref<OmikujiDataType>, initialData: OmikujiDataType) {
 const hasUnsavedChanges = ref<boolean>(false);
 const lastSavedDataHash = ref<string>('');
 const forceUpdateCounter = ref<number>(0); // 強制更新用カウンター

 /**
  * データのハッシュ値を計算
  */
 const calculateDataHash = (data: OmikujiDataType): string => {
  return JSON.stringify(data);
 };

 // 初期ハッシュ値の設定
 lastSavedDataHash.value = calculateDataHash(initialData);

 /**
  * データが変更されているかを判定（修正版）
  */
 const isDataChanged = computed(() => {
  // ハッシュ比較をやめて、フラグベースの管理に切り替え
  return hasUnsavedChanges.value;
 });

 /**
  * データが変更されたことをマーク（修正版）
  */
 const markAsChanged = async () => {
  hasUnsavedChanges.value = true;

  // 次のティックでハッシュ値の比較を強制実行
  await nextTick();
  forceUpdateCounter.value++;
 };

 /**
  * データが保存されたことをマーク
  */
 const markAsSaved = () => {
  hasUnsavedChanges.value = false;
  lastSavedDataHash.value = calculateDataHash(data.value);
  forceUpdateCounter.value++;
 };

 // データの深い変更を監視（追加の安全策）
 watch(
  () => data.value,
  async (newVal, oldVal) => {
   if (newVal !== oldVal) {
    // オブジェクトの参照が変わった場合
    await nextTick();
    forceUpdateCounter.value++;
   }
  },
  { deep: true, flush: 'post' }
 );

 return {
  hasUnsavedChanges,
  isDataChanged,
  markAsChanged,
  markAsSaved
 };
}
