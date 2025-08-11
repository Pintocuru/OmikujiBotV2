// src/configMaker/composables/useCategoryUtils.ts
import { storeToRefs } from 'pinia';
import { categoryLabels, CategoryType } from '@/types/';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { computed } from 'vue';

export const useCategoryUtils = () => {
 const omikujiStore = useOmikujiStore();
 const { data } = storeToRefs(omikujiStore);

 const getCategoryItemCount = (category: CategoryType): number => {
  const { gameScripts } = data.value.displaySettings.developer.visibility;

  if (category === 'scriptSettings') return gameScripts.length;
  if (category === 'displaySettings') return 0;
  if (category === 'meta') return 0;

  const items = data.value[category];
  return items ? Object.keys(items).length : 0;
 };

 /**
  * ナビゲーションの表示・非表示設定
  */
 const filteredCategoryLabels = computed<
  Record<CategoryType, (typeof categoryLabels)[CategoryType]>
 >(() => {
  const { proModeEnabled } = data.value.displaySettings.developer;
  const { gameScriptSettings, gameScripts } = data.value.displaySettings.developer.visibility;

  const excludeKeys: CategoryType[] = [];

  // scriptSettingsを除外
  if (!gameScriptSettings || gameScripts.length === 0) {
   excludeKeys.push('scriptSettings');
  }

  // showTemplateButtonがfalseならmetaを除外
  if (!proModeEnabled) {
   excludeKeys.push('meta');
  }

  return Object.fromEntries(
   Object.entries(categoryLabels).filter(([key]) => !excludeKeys.includes(key as CategoryType))
  ) as Record<CategoryType, (typeof categoryLabels)[CategoryType]>;
 });

 return {
  getCategoryItemCount,
  filteredCategoryLabels
 };
};
