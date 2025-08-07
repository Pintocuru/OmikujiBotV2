// src/ConfigMaker/script/useCommentRulesStore.ts
//
// データの直接操作を削除し、useRecordOperationsのメソッドを使うように修正
//
import { useRecordOperations } from './useRecordStore';
import { useOmikujiStore } from './useOmikujiStore';
import { defineStore } from 'pinia';

export const useCommentRulesStore = defineStore('commentRules', () => {
 const baseOperations = useRecordOperations('comments');
 const omikujiStore = useOmikujiStore();

 const updateRuleId = (oldId: string, newId: string): boolean => {
  try {
   const oldRule = baseOperations.rulesMap.value[oldId];
   if (!oldRule) {
    console.error(`Rule with ID ${oldId} not found`);
    return false;
   }
   if (baseOperations.rulesMap.value[newId]) {
    console.error(`Rule with ID ${newId} already exists`);
    return false;
   }

   // 新しいIDでレコードを追加する
   const newRuleId = baseOperations.add();

   // 新しいレコードのIDが期待通りでない場合はエラー
   if (newRuleId !== newId) {
    // 新しいIDのレコードは不要なので削除
    baseOperations.remove(newRuleId);
    console.error(`Generated new ID ${newRuleId} does not match requested new ID ${newId}`);
    return false;
   }

   // 古いレコードのプロパティを新しいレコードにコピー
   // `id`プロパティはコピーしないように除外する
   const { id, ...updates } = oldRule;
   baseOperations.update(newId, updates);

   // 古いレコードを削除
   baseOperations.remove(oldId);

   omikujiStore.selectRule(newId);

   return true;
  } catch (error) {
   console.error('Error updating rule ID:', error);
   return false;
  }
 };

 return {
  ...baseOperations,
  updateRuleId
 };
});
