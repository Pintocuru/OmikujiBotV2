// src/configMaker/components/RuleTabs/composables/useRuleOperations.ts
import { toast } from 'vue-sonner';
import { BaseTypes } from '@shared/types';
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore';
import { storeToRefs } from 'pinia';
import { computed, Ref } from 'vue';
import { recordCategoryLabel, RecordCategoryType, RecordCategoryTypeMap } from '@/types';

export const useRuleOperations = <K extends RecordCategoryType>(
 validCategory: Ref<K | undefined>,
 categoryArray: Ref<RecordCategoryTypeMap[K][] | undefined>
) => {
 const omikujiStore = useOmikujiStore();
 const { selectedCategory } = storeToRefs(omikujiStore);

 /**
  * カテゴリ操作の共通処理
  * カテゴリが無効な場合はearly returnで処理を中断
  */
 const withValidCategory = <T>(callback: (category: RecordCategoryType) => T): T | void => {
  const category = validCategory.value;
  if (!category) {
   console.error('Invalid category:', selectedCategory.value);
   return;
  }
  return callback(category);
 };

 // 新しいルールを追加
 const handleAddItem = () => {
  withValidCategory((category) => {
   omikujiStore.addItem?.(category);
   toast.success('新しいルールを追加しました', {
    description: 'ルールの設定を行ってください',
    duration: 3000
   });
  });
 };

 // ルールの内容を更新
 const handleUpdateRule = <C extends RecordCategoryType>(
  ruleId: string,
  updates: RecordCategoryTypeMap[C]
 ) => {
  withValidCategory((category) => {
   omikujiStore.updateItem(category, ruleId, updates);
   if (updates.name) {
    toast.success('ルールを更新しました', {
     description: `「${updates.name}」の設定を保存しました`,
     duration: 2000
    });
   }
  });
 };

 // ルールを削除（確認ダイアログ付き）
 const handleDeleteRule = (ruleId: string, ruleName?: string) => {
  withValidCategory((category) => {
   const name = ruleName || '名前未設定';
   toast.error(`「${name}」を削除しますか？`, {
    description: 'この操作は取り消せません',
    duration: 0,
    action: {
     label: '削除する',
     onClick: () => {
      omikujiStore.removeItem(category, ruleId);
      toast.success('ルールを削除しました', {
       description: `「${name}」を削除しました`,
       duration: 3000
      });
     }
    },
    cancel: {
     label: 'キャンセル',
     onClick: () => toast.dismiss()
    },
    closeButton: true
   });
  });
 };

 // ルールを複製
 const handleDuplicateRule = (ruleId: string) => {
  withValidCategory((category) => {
   omikujiStore.duplicateItem(category, ruleId);
   toast.success('ルールを複製しました', {
    description: 'コピーを作成しました',
    duration: 3000
   });
  });
 };

 // ルールを上に移動
 const handleMoveRuleUp = (ruleId: string, currentIndex: number) => {
  withValidCategory((category) => {
   if (currentIndex > 0) {
    omikujiStore.reorderItem(category, currentIndex, currentIndex - 1);
   }
  });
 };

 // ルールを下に移動
 const handleMoveRuleDown = (ruleId: string, currentIndex: number, totalLength: number) => {
  withValidCategory((category) => {
   if (currentIndex < totalLength - 1) {
    omikujiStore.reorderItem(category, currentIndex, currentIndex + 1);
   }
  });
 };

 /**
  * ルールのインデックス取得の共通処理
  * 配列とカテゴリの両方をチェックし、見つからない場合は0を返す
  */
 const getRuleIndex = (ruleId: string): number => {
  if (!categoryArray.value || !validCategory.value) {
   console.error('Invalid category:', selectedCategory.value);
   return 0;
  }
  return categoryArray.value.findIndex((rule: BaseTypes) => rule.id === ruleId);
 };

 // 元のインデックスを取得（現在はgetDisplayIndexと同じ実装）
 const getOriginalIndex = getRuleIndex;

 // 表示用インデックスを取得
 const getDisplayIndex = getRuleIndex;

 return {
  handleAddItem,
  handleUpdateRule,
  handleDuplicateRule,
  handleDeleteRule,
  handleMoveRuleUp,
  handleMoveRuleDown,
  getOriginalIndex,
  getDisplayIndex
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
