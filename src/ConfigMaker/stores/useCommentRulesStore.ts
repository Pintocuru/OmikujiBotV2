// src/ConfigMaker/script/useCommentRulesStore.ts - 単一の真実の泉を維持
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

   // 💡 修正: 単一の真実の泉を維持 - addメソッドに新しいIDを渡す
   const newRuleId = baseOperations.add(newId);

   if (newRuleId !== newId) {
    // 予期しない動作の場合はロールバック
    baseOperations.remove(newRuleId);
    console.error(`Could not create rule with ID ${newId}`);
    return false;
   }

   // 古いルールのデータ（idを除く）を新しいルールにコピー
   const { id, ...updates } = oldRule;
   baseOperations.update(newId, updates);

   // 古いルールを削除
   baseOperations.remove(oldId);

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
