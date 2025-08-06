// src/configMaker/components/RuleTabs/useDragAndDrop.ts
// ! 削除予定
import { ref, computed } from 'vue';
import type { RuleStore } from './RuleTabsTypes';
import { BaseTypes } from '@shared/types';

export function useDragAndDrop(
 filteredRules: () => BaseTypes[],
 allRules: () => BaseTypes[],
 store: RuleStore | undefined,
 searchQuery: () => string,
 isMultiSelectMode: () => boolean
) {
 const isDragging = ref(false);

 const draggableRules = computed({
  get: () => filteredRules(),
  set: (newOrder: BaseTypes[]) => {
   if (isDragging.value && !searchQuery() && !isMultiSelectMode()) {
    handleReorderFromDrag(newOrder);
   }
  }
 });

 const handleReorderFromDrag = (newOrder: BaseTypes[]) => {
  const originalOrder = [...allRules()];

  for (let newIndex = 0; newIndex < newOrder.length; newIndex++) {
   const rule = newOrder[newIndex];
   const currentIndex = originalOrder.findIndex((r) => r.id === rule.id);

   if (currentIndex !== -1 && currentIndex !== newIndex) {
    store?.reorder?.(currentIndex, newIndex);
    // 配列を更新（次のループで正確なインデックスを取得するため）
    const [movedRule] = originalOrder.splice(currentIndex, 1);
    originalOrder.splice(newIndex, 0, movedRule);
   }
  }
 };

 const onDragStart = () => {
  isDragging.value = true;
 };

 const onDragEnd = () => {
  setTimeout(() => {
   isDragging.value = false;
  }, 100);
 };

 return {
  draggableRules,
  onDragStart,
  onDragEnd
 };
}
