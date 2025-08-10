// src/configMaker/components/RecordTabs/composables/useDragAndDrop.ts
import { ref, computed, Ref } from 'vue';
import type { useRuleState } from './useRuleState';
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore';
import { BaseRecordType } from '@shared/types';

/**
 * ドラッグ&ドロップによる並び替え機能
 * Vuedraggableライブラリとの統合、順序変更の管理を提供
 */
export const useDragAndDrop = (
 ruleState: ReturnType<typeof useRuleState>,
 isMultiSelectMode: Ref<boolean>
) => {
 const omikujiStore = useOmikujiStore();
 const { filteredSortedItems, categoryArray, validCategory } = ruleState;

 /** ドラッグ操作中フラグ */
 const isDragging = ref(false);

 /**
  * Vuedraggableで使用する双方向バインド用computed
  * ドラッグ操作時のみ順序変更を実行
  */
 const draggableRules = computed({
  get: () => filteredSortedItems.value,
  set: (newOrder: BaseRecordType[]) => {
   // ドラッグ中かつマルチセレクトモードでない場合のみ並び替え実行
   if (isDragging.value && !isMultiSelectMode.value) {
    handleReorderFromDrag(newOrder);
   }
  }
 });

 /**
  * ドラッグ操作による順序変更を処理
  * 新しい順序に基づいて各ルールの位置を更新
  */
 const handleReorderFromDrag = (newOrder: BaseRecordType[]) => {
  if (!validCategory.value || !categoryArray.value) return;

  const originalOrder = [...categoryArray.value];

  // 新しい順序の各アイテムについて位置を更新
  for (let newIndex = 0; newIndex < newOrder.length; newIndex++) {
   const rule = newOrder[newIndex];
   const currentIndex = originalOrder.findIndex((r: BaseRecordType) => r.id === rule.id);

   // 位置が変更された場合のみ更新
   if (currentIndex !== -1 && currentIndex !== newIndex) {
    omikujiStore.reorderItem(validCategory.value, currentIndex, newIndex);

    // ローカルの配列も同期して更新
    const [movedRule] = originalOrder.splice(currentIndex, 1);
    originalOrder.splice(newIndex, 0, movedRule);
   }
  }
 };

 /** ドラッグ開始時の処理 */
 const onDragStart = () => {
  isDragging.value = true;
 };

 /** ドラッグ終了時の処理 */
 const onDragEnd = () => {
  // わずかな遅延を入れて他の処理との競合を避ける
  setTimeout(() => {
   isDragging.value = false;
  }, 100);
 };

 /**
  * ドラッグ可能かどうかを判定
  * マルチセレクトモード中は無効化
  */
 const isDragDisabled = computed(() => isMultiSelectMode.value);

 return {
  isDragging,
  draggableRules,
  isDragDisabled,
  onDragStart,
  onDragEnd
 };
};
