// src/ConfigMaker/script/usePlaceholderStore.ts
import { PlaceholderValueType, PlaceholderType, CharacterType } from '@/types/';
import { useOmikujiStore } from './useOmikujiStore';
import { useRecordOperations } from './useRecordStore';
import { defineStore } from 'pinia';
import { CommentRuleType, TimerRuleType } from '@/types/';

// CategoryTypeMap は useRecordStore.ts にあるものと同様に定義
type CategoryTypeMap = {
 comments: CommentRuleType;
 timers: TimerRuleType;
 placeholders: PlaceholderType;
 characters: CharacterType;
};

export const usePlaceholderStore = defineStore('placeholder', () => {
 const baseOperations = useRecordOperations('placeholders');
 const omikujiStore = useOmikujiStore();

 const checkPlaceholderExists = (id: string): boolean => {
  return !!omikujiStore.getCategoryItems('placeholders')[id];
 };

 const updatePlaceholderReferences = (oldId: string, newId: string): void => {
  const oldPlaceholder = `<<${oldId}>>`;
  const newPlaceholder = `<<${newId}>>`;
  const regex = new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

  // プレースホルダー内のcontent更新
  const placeholders = omikujiStore.getCategoryItems('placeholders');
  Object.entries(placeholders).forEach(([id, placeholder]) => {
   const updatedValues = (placeholder as any).values.map((value: any) => {
    return value.content.includes(oldPlaceholder)
     ? { ...value, content: value.content.replace(regex, newPlaceholder) }
     : value;
   });
   /**
    * spread 型はオブジェクトの種類からのみ作成できます。ts(2698)
(parameter) placeholder: unknown
    */
   // @ts-ignore
   omikujiStore.updateItemInCategory('placeholders', id, { ...placeholder, values: updatedValues });
  });

  // 修正: ジェネリクスを導入し、categoryとrulesの型を紐づける
  const updateRuleActions = <C extends 'comments' | 'timers'>(
   category: C,
   rules: Record<string, CategoryTypeMap[C]>
  ) => {
   Object.entries(rules).forEach(([ruleId, rule]) => {
    const updatedOmikuji = rule.omikuji.map((omikujiSet) => {
     const updatedPostActions = omikujiSet.postActions.map((action) => {
      const newAction = { ...action };
      if (newAction.messageContent?.includes(oldPlaceholder)) {
       newAction.messageContent = newAction.messageContent.replace(regex, newPlaceholder);
      }
      if (newAction.messageToast?.includes(oldPlaceholder)) {
       newAction.messageToast = newAction.messageToast.replace(regex, newPlaceholder);
      }
      if (newAction.wordParty?.includes(oldPlaceholder)) {
       newAction.wordParty = newAction.wordParty.replace(regex, newPlaceholder);
      }
      return newAction;
     });
     return { ...omikujiSet, postActions: updatedPostActions };
    });
    /**
     * 型 '{ omikuji: { postActions: { characterKey: string; iconKey: "default" | "happy" | "excited" | "laughing" | "blushing" | "surprised" | "sad" | "angry" | "thinking" | "wink" | "singing" | "sleepy"; delaySeconds: number; messageContent: string; wordParty?: string | undefined; messageToast?: string | undefined; }[]; id: ...' の引数を型 'Partial<{ ruleType: "comments"; threshold: { conditions: ("comment" | "syoken" | "access" | "gift" | "count")[]; syoken: ("syoken" | "again" | "firstVisit")[]; access: ("basic" | "member" | "subscriber" | "premium" | "moderator" | "owner")[]; gift: ("all" | ... 7 more ... | "purple")[]; count: { ...; }; comment: str...' のパラメーターに割り当てることはできません。
  型 '{ omikuji: { postActions: { characterKey: string; iconKey: "default" | "happy" | "excited" | "laughing" | "blushing" | "surprised" | "sad" | "angry" | "thinking" | "wink" | "singing" | "sleepy"; delaySeconds: number; messageContent: string; wordParty?: string | undefined; messageToast?: string | undefined; }[]; id: ...' を型 'Partial<{ ruleType: "comments"; threshold: { conditions: ("comment" | "syoken" | "access" | "gift" | "count")[]; syoken: ("syoken" | "again" | "firstVisit")[]; access: ("basic" | "member" | "subscriber" | "premium" | "moderator" | "owner")[]; gift: ("all" | ... 7 more ... | "purple")[]; count: { ...; }; comment: str...' に割り当てることはできません。
    プロパティ 'ruleType' の型に互換性がありません。
      型 '"timers"' を型 '"comments"' に割り当てることはできません。ts(2345)
(parameter) rule: {
    ruleType: "comments";
    threshold: {
        conditions: ("comment" | "syoken" | "access" | "gift" | "count")[];
        syoken: ("syoken" | "again" | "firstVisit")[];
        access: ("basic" | "member" | "subscriber" | "premium" | "moderator" | "owner")[];
        gift: ("all" | ... 7 more ... | "purple")[];
        count: {
            ...;
        };
        comment: string[];
    };
    ... 9 more ...;
    description?: string | undefined;
} | {
    ...;
}
     */
    //@ts-ignore
    omikujiStore.updateItemInCategory(category, ruleId, { ...rule, omikuji: updatedOmikuji });
   });
  };

  // 修正: `as const`を使用して型を厳密に推論させる
  updateRuleActions(
   'comments',
   omikujiStore.getCategoryItems('comments') as Record<string, CommentRuleType>
  );
  updateRuleActions(
   'timers',
   omikujiStore.getCategoryItems('timers') as Record<string, TimerRuleType>
  );
 };

 const updatePlaceholderName = (id: string, newName: string): boolean => {
  if (!checkPlaceholderExists(id)) return false;
  baseOperations.update(id, { name: newName });
  return true;
 };

 const updatePlaceholderValues = (id: string, values: PlaceholderValueType[]): boolean => {
  if (!checkPlaceholderExists(id)) return false;
  baseOperations.update(id, { values });
  return true;
 };

 const updatePlaceholderId = (oldId: string, newId: string): boolean => {
  if (!checkPlaceholderExists(oldId) || checkPlaceholderExists(newId)) {
   return false;
  }
  const placeholderData = baseOperations.rulesMap.value[oldId];
  if (placeholderData) {
   // 修正: 新しいIDでレコードを複製し、古いレコードを削除する
   const { id, ...updates } = placeholderData;
   omikujiStore.addItemToCategory('placeholders', newId, { ...updates, id: newId });
   omikujiStore.removeItemFromCategory('placeholders', oldId);
   if (omikujiStore.selectedRuleId === oldId) {
    omikujiStore.selectRule(newId);
   }
   updatePlaceholderReferences(oldId, newId);
   return true;
  }
  return false;
 };

 return {
  ...baseOperations,
  updatePlaceholderName,
  updatePlaceholderId,
  updatePlaceholderValues
 };
});
