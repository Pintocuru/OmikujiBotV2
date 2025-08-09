// src/configMaker/components/RuleTabs/composables/useDragAndDrop.ts
import { ref, computed, Ref } from 'vue';
import { BaseTypes } from '@shared/types';
import { RecordCategoryType, RecordCategoryTypeMap } from '@/types';
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore';

export const useDragAndDrop = <K extends RecordCategoryType>(
 filteredSortedRules: Ref<RecordCategoryTypeMap[K][]>,
 categoryArray: Ref<RecordCategoryTypeMap[K][] | undefined>,
 isMultiSelectMode: Ref<boolean>,
 category: Ref<K | undefined>
) => {
 const omikujiStore = useOmikujiStore();
 const isDragging = ref(false);

 // 使ってる
 const draggableRules = computed({
  get: () => filteredSortedRules.value,
  set: (newOrder: BaseTypes[]) => {
   if (isDragging.value && !isMultiSelectMode.value) {
    handleReorderFromDrag(newOrder);
   }
  }
 });

 const handleReorderFromDrag = (newOrder: BaseTypes[]) => {
  const originalOrder = [...(categoryArray.value ?? [])];

  for (let newIndex = 0; newIndex < newOrder.length; newIndex++) {
   const rule = newOrder[newIndex];
   const currentIndex = originalOrder.findIndex((r: BaseTypes) => r.id === rule.id);

   if (currentIndex !== -1 && currentIndex !== newIndex) {
    omikujiStore.reorderItem(category.value as K, currentIndex, newIndex);
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
