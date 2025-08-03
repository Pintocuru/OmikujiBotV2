// src/ConfigMaker/script/useRecordStore.ts - 共通ルールストア
import { computed } from 'vue';
import {
 CommentRuleSchema,
 CommentRuleType,
 PlaceholderSchema,
 PlaceholderType,
 TimerRuleSchema,
 TimerRuleType
} from '@type/';
import { CharacterSchema, CharacterType } from '@type/';
import { useOmikujiStore } from './useOmikujiStore';

// 共通のルール操作を提供するコンポーザブル
type Category = 'comments' | 'timers' | 'placeholders' | 'characters';

type CategoryTypeMap = {
 comments: CommentRuleType;
 timers: TimerRuleType;
 placeholders: PlaceholderType;
 characters: CharacterType;
};

// スキーママップ - factoryMapと統合
const categoryConfig = {
 comments: { schema: CommentRuleSchema, defaultName: 'コメントルール' },
 timers: { schema: TimerRuleSchema, defaultName: 'タイマールール' },
 placeholders: { schema: PlaceholderSchema, defaultName: 'プレースホルダー' },
 characters: { schema: CharacterSchema, defaultName: 'キャラクター設定' }
} as const;

export function useRecordOperations<C extends Category>(category: C) {
 const omikujiStore = useOmikujiStore();
 const config = categoryConfig[category];

 // 統合されたファクトリー関数
 const createRecord = (): CategoryTypeMap[C] => {
  return config.schema.parse({}) as CategoryTypeMap[C];
 };

 // データ取得（共通化）
 const getData = (): Record<string, CategoryTypeMap[C]> => {
  return omikujiStore.data[category] as Record<string, CategoryTypeMap[C]>;
 };

 // Record型のデータ（キーがID、値がルールオブジェクト）
 const rulesMap = computed<Record<string, CategoryTypeMap[C]>>(() => getData());

 // 配列形式のデータ（ソート済み）
 const rulesArray = computed<CategoryTypeMap[C][]>(() =>
  Object.values(getData()).sort((a, b) => a.order - b.order)
 );

 // リアクティブな書き込み可能selectedRule
 const selectedRule = computed<CategoryTypeMap[C] | null>({
  get: () => {
   if (omikujiStore.selectedCategory !== category) return null;
   const data = getData();
   if (!omikujiStore.selectedRuleId) return null;
   return data[omikujiStore.selectedRuleId] ?? null;
  },
  set: (value) => {
   if (value && omikujiStore.selectedRuleId) {
    update(omikujiStore.selectedRuleId, value);
   }
  }
 });

 // ネストされたプロパティ用のヘルパー
 const selectedRuleNested = <K extends keyof CategoryTypeMap[C]>(key: K) =>
  computed<CategoryTypeMap[C][K] | undefined>({
   get: () => selectedRule.value?.[key],
   set: (value) => {
    if (value !== undefined && selectedRule.value) {
     update(selectedRule.value.id, { [key]: value } as Partial<CategoryTypeMap[C]>);
    }
   }
  });

 // 統合されたCRUD操作
 const add = (): string => {
  const newRule = createRecord();
  const id = `${Date.now()}`;
  const data = getData();
  const count = Object.keys(data).length;

  newRule.id = id;
  newRule.name = `新しい${config.defaultName} ${count + 1}`;
  newRule.order = count;

  data[id] = newRule;
  omikujiStore.selectCategory(category);
  omikujiStore.selectRule(id);
  return id;
 };

 const update = (id: string, updates: Partial<CategoryTypeMap[C]>): boolean => {
  const data = getData();
  const rule = data[id];
  if (rule) {
   data[id] = { ...rule, ...updates };
   return true;
  }
  return false;
 };

 const remove = (id: string): boolean => {
  const data = getData();
  if (data[id]) {
   delete data[id];
   if (omikujiStore.selectedRuleId === id) {
    omikujiStore.clearSelection();
   }
   return true;
  }
  return false;
 };

 const duplicate = (id: string): string | null => {
  const data = getData();
  const original = data[id];
  if (original) {
   const newId = `${Date.now()}`;
   const duplicated: CategoryTypeMap[C] = {
    ...original,
    id: newId,
    name: `${original.name} (コピー)`,
    order: Object.keys(data).length
   };
   data[newId] = duplicated;
   omikujiStore.selectRule(newId);
   return newId;
  }
  return null;
 };

 const reorder = (fromIndex: number, toIndex: number) => {
  const ruleList = rulesArray.value;
  const ids = ruleList.map((rule) => rule.id);
  const [movedId] = ids.splice(fromIndex, 1);
  ids.splice(toIndex, 0, movedId);

  const data = getData();
  ids.forEach((id, index) => {
   if (data[id]) {
    data[id].order = index;
   }
  });
 };

 return {
  rulesArray,
  rulesMap,
  selectedRule,
  getData,
  selectedRuleNested,
  add,
  update,
  remove,
  duplicate,
  reorder
 };
}
