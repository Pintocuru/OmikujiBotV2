// src/configMaker/components/RuleTabs/composables/useDragAndDrop.ts
import { ref, computed } from 'vue';
import { BaseTypes } from '@shared/types';

export const useDragAndDrop = (
 filteredSortedRules: any,
 allRules: any,
 externalStore: any,
 isMultiSelectMode: any
) => {
 const isDragging = ref(false);

 const draggableRules = computed({
  get: () => filteredSortedRules.value,
  set: (newOrder: BaseTypes[]) => {
   if (isDragging.value && !isMultiSelectMode.value) {
    handleReorderFromDrag(newOrder);
   }
  }
 });

 const handleReorderFromDrag = (newOrder: BaseTypes[]) => {
  const originalOrder = [...allRules.value];

  for (let newIndex = 0; newIndex < newOrder.length; newIndex++) {
   const rule = newOrder[newIndex];
   const currentIndex = originalOrder.findIndex((r: BaseTypes) => r.id === rule.id);

   if (currentIndex !== -1 && currentIndex !== newIndex) {
    externalStore.value?.reorder?.(currentIndex, newIndex);
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
  isDragging,
  draggableRules,
  onDragStart,
  onDragEnd
 };
};
