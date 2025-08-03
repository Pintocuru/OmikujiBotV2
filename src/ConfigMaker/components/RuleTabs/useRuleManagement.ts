// src/configMaker/components/RuleTabs/useRuleManagement.ts
import { inject } from 'vue';
import { toast } from 'vue-sonner';
import type { CategoryType } from '@type/';
import type { BaseRule, RuleStore } from './RuleTabsTypes';

export function useRuleManagement(ruleType: CategoryType) {
 const injectedStore = inject<RuleStore>(`${ruleType}RulesStore`);

 const handleSelectRule = (ruleId: string) => {
  injectedStore?.selectRule?.(ruleId);
 };

 const handleAddNewRule = () => {
  injectedStore?.add?.();
  toast.success('新しいルールを追加しました', {
   description: 'ルールの設定を行ってください',
   duration: 3000
  });
 };

 const handleUpdateRule = (ruleId: string, updates: Partial<BaseRule>) => {
  injectedStore?.update?.(ruleId, updates);

  // 名前の更新時のみトーストを表示（頻繁な更新を避けるため）
  if (updates.name) {
   toast.success('ルールを更新しました', {
    description: `「${updates.name}」の設定を保存しました`,
    duration: 2000
   });
  }
 };

 const handleDuplicateRule = (ruleId: string) => {
  injectedStore?.duplicate?.(ruleId);
  toast.success('ルールを複製しました', {
   description: `コピーを作成しました`,
   duration: 3000
  });
 };

 const handleMoveRuleUp = (ruleId: string, currentIndex: number) => {
  if (currentIndex > 0) {
   injectedStore?.reorder?.(currentIndex, currentIndex - 1);
  }
 };

 const handleMoveRuleDown = (ruleId: string, currentIndex: number, maxIndex: number) => {
  if (currentIndex < maxIndex - 1) {
   injectedStore?.reorder?.(currentIndex, currentIndex + 1);
  }
 };

 const handleDeleteRule = (ruleId: string, ruleName?: string) => {
  const name = ruleName || '名前未設定';

  // 削除確認のトーストを表示（目立つように）
  toast.error(`「${name}」を削除しますか？`, {
   description: 'この操作は取り消せません',
   duration: 0, // 手動で閉じるまで表示
   action: {
    label: '削除する',
    onClick: () => {
     injectedStore?.remove?.(ruleId);
     // 削除完了のトーストを表示
     toast.success('ルールを削除しました', {
      description: `「${name}」を削除しました`,
      duration: 3000
     });
    }
   },
   cancel: {
    label: 'キャンセル',
    onClick: () => {
     toast.dismiss();
    }
   },
   closeButton: true
  });
 };

 return {
  handleSelectRule,
  handleAddNewRule,
  handleUpdateRule,
  handleDuplicateRule,
  handleMoveRuleUp,
  handleMoveRuleDown,
  handleDeleteRule
 };
}
