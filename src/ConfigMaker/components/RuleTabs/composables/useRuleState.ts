// src/configMaker/components/RuleTabs/composables/useRuleState.ts
import { ref, computed } from 'vue';
import { recordCategoryLabel, RecordCategoryType } from '@/types/';
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore';
import { storeToRefs } from 'pinia';

export interface FilterOptions {
 enabledOnly: boolean;
 colorFilter: string | null;
}

export const useRuleState = () => {
 const omikujiStore = useOmikujiStore();
 const { selectedCategory } = storeToRefs(omikujiStore);

 // 選択中のカテゴリをRecordCategoryTypeに変換（型安全）
 const validCategory = computed(() => toRecordCategory(selectedCategory.value));

 // 現在のカテゴリの配列データを取得
 const categoryArray = computed(() => {
  const category = validCategory.value;
  if (!category) {
   console.error('Invalid category:', selectedCategory.value);
   return;
  }
  return omikujiStore.getCategoryArray(category);
 });

 // 選択しているもの(single)
 const selectedRuleId = ref<string | null>(null);
 const selectedItem = computed(() => {
  if (!validCategory.value || !selectedRuleId.value) return null;
  return omikujiStore.getItem(validCategory.value, selectedRuleId.value);
 });

 // フィルター状態
 const filterOptions = ref<FilterOptions>({
  enabledOnly: false,
  colorFilter: null
 });

 // 検索状態
 const searchQuery = ref('');

 // 計算プロパティ
 const sortedItems = computed(() =>
  Array.isArray(categoryArray.value)
   ? categoryArray.value.slice().sort((a, b) => a.order - b.order)
   : []
 );

 // Filterされたitems
 const filteredSortedItems = computed(() => {
  let filtered = sortedItems.value;

  // 有効のみのフィルター
  if (filterOptions.value.enabledOnly) {
   filtered = filtered.filter((rule) => rule.isEnabled !== false);
  }

  // カラーフィルター
  if (filterOptions.value.colorFilter) {
   filtered = filtered.filter((rule) => rule.editorColor === filterOptions.value.colorFilter);
  }

  return filtered;
 });

 // カテゴリで使われている editorColor を取得
 const getUniqueColors = computed(() => {
  if (!categoryArray.value) return [];
  const colors = new Set<string>();
  categoryArray.value.forEach((rule) => {
   if (rule.editorColor) {
    colors.add(rule.editorColor);
   }
  });
  return Array.from(colors);
 });

 return {
  // State
  validCategory,
  categoryArray,
  selectedItem,
  filterOptions,
  searchQuery,

  // Computed
  sortedItems,
  filteredSortedItems,
  getUniqueColors
 };
};

/**
 * 型ガード関数: CategoryType のうち RecordCategoryType だけを通す
 * @param value - チェックする値
 * @returns RecordCategoryTypeまたはundefined
 */
function toRecordCategory(value: string): RecordCategoryType | undefined {
 return (recordCategoryLabel as readonly string[]).includes(value as RecordCategoryType)
  ? (value as RecordCategoryType)
  : undefined;
}
