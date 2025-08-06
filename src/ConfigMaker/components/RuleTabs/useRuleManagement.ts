// src/configMaker/components/RuleTabs/useRuleManagement.ts
import { inject } from 'vue';
import { toast } from 'vue-sonner';
import type { CategoryType } from '@/types/';
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

 // 修正版：インデックスの扱いを明確に
 const handleMoveRuleUp = (ruleId: string, currentIndex: number) => {
  if (currentIndex > 0) {
   injectedStore?.reorder?.(currentIndex, currentIndex - 1);
  }
 };

 const handleMoveRuleDown = (ruleId: string, currentIndex: number, totalLength: number) => {
  if (currentIndex < totalLength - 1) {
   injectedStore?.reorder?.(currentIndex, currentIndex + 1);
  }
 };

 const handleDeleteRule = (ruleId: string, ruleName?: string) => {
  const name = ruleName || '名前未設定';

  // 削除確認のトーストを表示
  toast.error(`「${name}」を削除しますか？`, {
   description: 'この操作は取り消せません',
   duration: 0,
   action: {
    label: '削除する',
    onClick: () => {
     injectedStore?.remove?.(ruleId);
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

 // 新機能：一括削除
 const handleBulkDeleteRules = (rulesToDelete: BaseRule[]) => {
  if (rulesToDelete.length === 0) return;

  const ruleNames = rulesToDelete.map((rule) => rule.name || '名前未設定').join('、');
  const count = rulesToDelete.length;

  toast.error(`${count}件のルールを削除しますか？`, {
   description: `削除対象: ${ruleNames.length > 50 ? ruleNames.substring(0, 50) + '...' : ruleNames}`,
   duration: 0,
   action: {
    label: `${count}件削除する`,
    onClick: () => {
     // 逆順で削除（インデックスのズレを防ぐため）
     const sortedRules = [...rulesToDelete].sort((a, b) => {
      const indexA = injectedStore?.rules?.findIndex((rule) => rule.id === a.id) ?? -1;
      const indexB = injectedStore?.rules?.findIndex((rule) => rule.id === b.id) ?? -1;
      return indexB - indexA; // 降順
     });

     sortedRules.forEach((rule) => {
      injectedStore?.remove?.(rule.id);
     });

     toast.success(`${count}件のルールを削除しました`, {
      description: '一括削除が完了しました',
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
  handleDeleteRule,
  handleBulkDeleteRules // 新機能
 };
}
