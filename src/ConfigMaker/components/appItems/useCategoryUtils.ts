// src/configMaker/composables/useCategoryUtils.ts
import { storeToRefs } from 'pinia';
import { CategoryType } from '@/types/';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { scriptGameKeys } from '@/ScriptGame/ScriptGameMap';

export const useCategoryUtils = () => {
 const omikujiStore = useOmikujiStore();
 const { data } = storeToRefs(omikujiStore);

 const getCategoryItemCount = (category: CategoryType): number => {
  if (category === 'scriptSettings') return scriptGameKeys.length;
  if (category === 'displaySettings') return 0;

  const items = data.value[category];
  return items ? Object.keys(items).length : 0;
 };

 return {
  getCategoryItemCount
 };
};
