// src/ConfigMaker/script/stores/useRecordStore.ts
import { computed } from 'vue';
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
 CategoryType
} from '@/types/';
import { useOmikujiStore } from './useOmikujiStore';

/**
 * カテゴリごとの型マッピング
 */
type CategoryTypeMap = {
 comments: CommentRuleType;
 timers: TimerRuleType;
 placeholders: PlaceholderType;
 characters: CharacterType;
};

/**
 * カテゴリ別の設定情報
 * 各カテゴリのスキーマとデフォルト名を管理
 */
const categoryConfig: Record<SelectCategoryType, { schema: any; defaultName: string }> = {
 comments: { schema: CommentRuleSchema, defaultName: 'コメントルール' },
 timers: { schema: TimerRuleSchema, defaultName: 'タイマールール' },
 placeholders: { schema: PlaceholderSchema, defaultName: 'プレースホルダー' },
 characters: { schema: CharacterSchema, defaultName: 'キャラクター設定' }
} as const;

/**
 * 特定のカテゴリに対する共通のレコード操作を提供するコンポーザブル
 *
 * このコンポーザブルは、複数のカテゴリ（comments、timers、placeholders、characters）に
 * 共通するCRUD操作とリアクティブな状態管理を提供します。
 *
 * 実際のデータ操作はuseOmikujiStoreに委譲し、このレイヤーでは
 * カテゴリ固有のロジックとビジネスルールを実装します。
 *
 * @template C - 操作対象のカテゴリタイプ
 * @param category - 操作対象のカテゴリ名
 */
export function useRecordOperations<C extends SelectCategoryType>(category: C) {
 const omikujiStore = useOmikujiStore();
 const config = categoryConfig[category];

 /**
  * スキーマを使用してレコードを作成・検証
  * @param data - レコードのデータ（部分的でも可）
  * @returns バリデーションされたレコード
  */
 const createRecord = (data: any = {}): CategoryTypeMap[C] => {
  return config.schema.parse(data) as CategoryTypeMap[C];
 };

 /**
  * カテゴリ内の全レコードをマップ形式で取得
  * リアクティブに更新される
  */
 const rulesMap = computed<Record<string, CategoryTypeMap[C]>>(() =>
  omikujiStore.getCategoryItems<CategoryTypeMap[C]>(category)
 );

 /**
  * カテゴリ内の全レコードを配列形式で取得
  * order順にソートされる
  */
 const rulesArray = computed<CategoryTypeMap[C][]>(() =>
  Object.values(rulesMap.value).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
 );

 /**
  * 現在選択されているレコード
  * getter: 現在選択中のレコードを返す
  * setter: レコードを更新する
  */
 const selectedRule = computed<CategoryTypeMap[C] | null>({
  get: () => {
   // 異なるカテゴリが選択されている場合はnull
   if (omikujiStore.selectedCategory !== category) return null;

   const data = rulesMap.value;
   if (!omikujiStore.selectedRuleId) return null;

   return data[omikujiStore.selectedRuleId] ?? null;
  },
  set: (value) => {
   if (value && omikujiStore.selectedRuleId) {
    omikujiStore.updateItemInCategory(
     category,
     omikujiStore.selectedRuleId,
     value as Partial<CategoryTypeMap[C]>
    );
   }
  }
 });

 /**
  * 選択されたレコードの特定プロパティにアクセスするcomputed
  * ネストしたプロパティの更新を効率的に行う
  *
  * @template K - プロパティのキー
  * @param key - アクセスするプロパティのキー
  * @returns リアクティブなプロパティ参照
  */
 const selectedRuleNested = <K extends keyof CategoryTypeMap[C]>(key: K) =>
  computed<CategoryTypeMap[C][K] | undefined>({
   get: () => selectedRule.value?.[key],
   set: (value) => {
    if (value !== undefined && selectedRule.value) {
     omikujiStore.updateRuleNestedProperty(category, selectedRule.value.id, key, value);
    }
   }
  });

 /**
  * 新しいレコードを追加
  * 自動的にIDを生成し、デフォルト値を設定して追加する
  *
  * @returns 生成された新しいレコードのID
  */
 const add = (): string => {
  const id = `${Date.now()}`;
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

 /**
  * 既存のレコードを更新
  *
  * @param id - 更新対象のレコードID
  * @param updates - 更新内容（部分更新可）
  * @returns 更新の成功/失敗
  */
 const update = (id: string, updates: Partial<CategoryTypeMap[C]>): boolean => {
  omikujiStore.updateItemInCategory(category, id, updates);
  return true;
 };

 /**
  * レコードを削除
  * 削除されたレコードが選択されていた場合、選択状態もクリアする
  *
  * @param id - 削除対象のレコードID
  * @returns 削除の成功/失敗
  */
 const remove = (id: string): boolean => {
  const removed = omikujiStore.getItemFromCategory(category, id);
  if (removed) {
   omikujiStore.removeItemFromCategory(category, id);

   // 削除されたレコードが選択されていた場合は選択をクリア
   if (omikujiStore.selectedRuleId === id) {
    omikujiStore.clearSelection();
   }
   return true;
  }
  return false;
 };

 /**
  * レコードを複製
  * 複製されたレコードは自動的に選択される
  *
  * @param id - 複製元のレコードID
  * @returns 複製されたレコードのID（失敗時はnull）
  */
 const duplicate = (id: string): string | null => {
  const newId = omikujiStore.duplicateItemInCategory(category, id);
  if (newId) {
   omikujiStore.selectRule(newId);
  }
  return newId;
 };

 /**
  * レコードの順序を変更
  * ドラッグ&ドロップなどでの並び替えに使用
  *
  * @param fromIndex - 移動元のインデックス
  * @param toIndex - 移動先のインデックス
  */
 const reorder = (fromIndex: number, toIndex: number) => {
  const ruleList = rulesArray.value;
  const ids = ruleList.map((rule) => rule.id);

  // 配列内での要素移動
  const [movedId] = ids.splice(fromIndex, 1);
  ids.splice(toIndex, 0, movedId);

  // 新しい順序でorderプロパティを更新
  const updatedRules: Record<string, CategoryTypeMap[C]> = {};
  ids.forEach((id, index) => {
   const rule = omikujiStore.getItemFromCategory<CategoryTypeMap[C]>(category, id);
   if (rule) {
    updatedRules[id] = { ...rule, order: index + 1 };
   }
  });

  omikujiStore.updateCategoryData(category as CategoryType, updatedRules);
 };

 return {
  // リアクティブな状態
  rulesArray,
  rulesMap,
  selectedRule,
  selectedRuleNested,

  // CRUD操作
  add,
  update,
  remove,
  duplicate,
  reorder
 };
}
