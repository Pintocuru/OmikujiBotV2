// src/ConfigMaker/script/useRecordStore.ts - add関数にid引数を追加
import { computed, nextTick } from 'vue';
import {
 CommentRuleSchema,
 CommentRuleType,
 PlaceholderSchema,
 PlaceholderType,
 SelectCategoryType,
 TimerRuleSchema,
 TimerRuleType,
 CharacterSchema,
 CharacterType,
 RuleType,
 CategoryType
} from '@/types/';
import { useOmikujiStore } from './useOmikujiStore';

type CategoryTypeMap = {
 comments: CommentRuleType;
 timers: TimerRuleType;
 placeholders: PlaceholderType;
 characters: CharacterType;
};

const categoryConfig: Record<SelectCategoryType, { schema: any; defaultName: string }> = {
 comments: { schema: CommentRuleSchema, defaultName: 'コメントルール' },
 timers: { schema: TimerRuleSchema, defaultName: 'タイマールール' },
 placeholders: { schema: PlaceholderSchema, defaultName: 'プレースホルダー' },
 characters: { schema: CharacterSchema, defaultName: 'キャラクター設定' }
} as const;

export function useRecordOperations<C extends SelectCategoryType>(category: C) {
 const omikujiStore = useOmikujiStore();
 const config = categoryConfig[category];

 const createRecord = (data: any = {}): CategoryTypeMap[C] => {
  return config.schema.parse(data) as CategoryTypeMap[C];
 };

 const rulesMap = computed<Record<string, CategoryTypeMap[C]>>(() =>
  omikujiStore.getCategoryItems<CategoryTypeMap[C]>(category)
 );

 const rulesArray = computed<CategoryTypeMap[C][]>(() =>
  Object.values(rulesMap.value).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
 );

 const selectedRule = computed<CategoryTypeMap[C] | null>({
  get: () => {
   if (omikujiStore.selectedCategory !== category) return null;
   const data = rulesMap.value;
   if (!omikujiStore.selectedRuleId) return null;
   return data[omikujiStore.selectedRuleId] ?? null;
  },
  set: async (value) => {
   if (value && omikujiStore.selectedRuleId) {
    await nextTick();
    omikujiStore.updateItemInCategory(
     category,
     omikujiStore.selectedRuleId,
     value as Partial<CategoryTypeMap[C]>
    );
   }
  }
 });

 const updateItem = async (updates: Partial<CategoryTypeMap[C]>) => {
  if (omikujiStore.selectedRuleId) {
   await nextTick();
   omikujiStore.updateItemInCategory(category, omikujiStore.selectedRuleId, updates);
  }
 };

 // 💡 修正: addメソッドにオプショナルなid引数を追加
 const add = (customId?: string): string => {
  const id = customId || `${Date.now()}`;

  // IDの重複チェック
  if (rulesMap.value[id]) {
   console.warn(`ID ${id} already exists. Using generated ID instead.`);
   return add(); // 再帰的に自動生成IDで実行
  }

  const count = Object.keys(rulesMap.value).length + 1;
  const newRule = createRecord({
   id,
   name: `新しい${config.defaultName} ${count}`,
   order: count
  });

  omikujiStore.addItemToCategory(category, id, newRule);
  omikujiStore.selectCategory(category);
  omikujiStore.selectRule(id);
  return id;
 };

 const update = async (id: string, updates: Partial<CategoryTypeMap[C]>): Promise<boolean> => {
  await nextTick();
  omikujiStore.updateItemInCategory(category, id, updates);
  return true;
 };

 const remove = (id: string): boolean => {
  const removed = omikujiStore.getItemFromCategory(category, id);
  if (removed) {
   omikujiStore.removeItemFromCategory(category, id);
   if (omikujiStore.selectedRuleId === id) {
    omikujiStore.clearSelection();
   }
   return true;
  }
  return false;
 };

 const duplicate = (id: string): string | null => {
  const newId = omikujiStore.duplicateItemInCategory(category, id);
  if (newId) omikujiStore.selectRule(newId);
  return newId;
 };

 const reorder = async (fromIndex: number, toIndex: number) => {
  const ruleList = rulesArray.value;
  const ids = ruleList.map((rule) => rule.id);
  const [movedId] = ids.splice(fromIndex, 1);
  ids.splice(toIndex, 0, movedId);

  const updatedRules: Record<string, CategoryTypeMap[C]> = {};
  ids.forEach((id, index) => {
   const rule = omikujiStore.getItemFromCategory<CategoryTypeMap[C]>(category, id);
   if (rule) {
    updatedRules[id] = { ...rule, order: index + 1 };
   }
  });

  await nextTick();
  omikujiStore.updateCategoryData(category as CategoryType, updatedRules);
 };

 return {
  rulesArray,
  rulesMap,
  selectedRule,
  add,
  update,
  remove,
  duplicate,
  reorder,
  updateItem,
  createRecord
 };
}
