// src/configMaker/composables/useCategoryUtils.ts
import { storeToRefs } from 'pinia';
import { categoryLabels, CategoryType } from '@/types/';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { scriptGameKeys } from '@/ScriptGame/ScriptGameMap';
import { computed } from 'vue';

export const useCategoryUtils = () => {
 const omikujiStore = useOmikujiStore();
 const { data } = storeToRefs(omikujiStore);

 const getCategoryItemCount = (category: CategoryType): number => {
  const { availableGameScripts } = data.value.displaySettings.developer;

  if (category === 'scriptSettings') return availableGameScripts.length;
  if (category === 'displaySettings') return 0;

  const items = data.value[category];
  return items ? Object.keys(items).length : 0;
 };

 const filteredCategoryLabels = computed(() => {
  const { enabledGameScriptSettings, availableGameScripts } = data.value.displaySettings.developer;
  // scriptSettingsを除外
  if (!enabledGameScriptSettings || availableGameScripts.length === 0) {
   return Object.fromEntries(
    Object.entries(categoryLabels).filter(([key]) => key !== 'scriptSettings')
   );
  }
  // それ以外の場合は、元のcategoryLabelsをそのまま返す
  return categoryLabels;
 });

 return {
  getCategoryItemCount,
  filteredCategoryLabels
 };
};
