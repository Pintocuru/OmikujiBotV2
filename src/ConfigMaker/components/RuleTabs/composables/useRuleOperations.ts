// src/configMaker/components/RuleTabs/composables/useRuleOperations.ts
import { toast } from 'vue-sonner';
import { BaseTypes } from '@shared/types';

export const useRuleOperations = (externalStore: any, allRules: any) => {
 const handleSelectRule = (ruleId: string) => {
  externalStore.value?.selectRule?.(ruleId);
 };

 const handleAddNewRule = () => {
  externalStore.value?.add?.();
  toast.success('新しいルールを追加しました', {
   description: 'ルールの設定を行ってください',
   duration: 3000
  });
 };

 const handleUpdateRule = (ruleId: string, updates: BaseTypes) => {
  externalStore.value?.update?.(ruleId, updates);
  if (updates.name) {
   toast.success('ルールを更新しました', {
    description: `「${updates.name}」の設定を保存しました`,
    duration: 2000
   });
  }
 };

 const handleDuplicateRule = (ruleId: string) => {
  externalStore.value?.duplicate?.(ruleId);
  toast.success('ルールを複製しました', {
   description: 'コピーを作成しました',
   duration: 3000
  });
 };

 const handleDeleteRule = (ruleId: string, ruleName?: string) => {
  const name = ruleName || '名前未設定';
  toast.error(`「${name}」を削除しますか？`, {
   description: 'この操作は取り消せません',
   duration: 0,
   action: {
    label: '削除する',
    onClick: () => {
     externalStore.value?.remove?.(ruleId);
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
 };

 const handleMoveRuleUp = (ruleId: string, currentIndex: number) => {
  if (currentIndex > 0) {
   externalStore.value?.reorder?.(currentIndex, currentIndex - 1);
  }
 };

 const handleMoveRuleDown = (ruleId: string, currentIndex: number, totalLength: number) => {
  if (currentIndex < totalLength - 1) {
   externalStore.value?.reorder?.(currentIndex, currentIndex + 1);
  }
 };

 const getOriginalIndex = (ruleId: string): number => {
  return allRules.value.findIndex((rule: BaseTypes) => rule.id === ruleId);
 };

 const getDisplayIndex = (ruleId: string) => {
  return allRules.value.findIndex((rule: BaseTypes) => rule.id === ruleId);
 };

 return {
  handleSelectRule,
  handleAddNewRule,
  handleUpdateRule,
  handleDuplicateRule,
  handleDeleteRule,
  handleMoveRuleUp,
  handleMoveRuleDown,
  getOriginalIndex,
  getDisplayIndex
 };
};
