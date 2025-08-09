// 🔴 src/ConfigMaker/script/useCharacterStore.ts
//
// データの直接操作を削除し、useRecordOperationsのメソッドを使うように修正
//
import { CommentRuleType, TimerRuleType } from '@/types/';
import { useRecordOperations } from './useRecordStore';
import { useOmikujiStore } from './useOmikujiStore';
import { defineStore } from 'pinia';

export const useCharacterStore = defineStore('characterRules', () => {
 const baseOperations = useRecordOperations('characters');
 const omikujiStore = useOmikujiStore();

 const updateCharacterId = (oldId: string, newId: string): boolean => {
  const character = baseOperations.rulesMap.value[oldId];
  if (!character || baseOperations.rulesMap.value[newId]) {
   return false;
  }

  // 🔴 修正: useRecordOperations の `remove` と `add` を使って更新
  baseOperations.remove(oldId);
  baseOperations.add();

  // 🔴 修正: ネストされたプロパティの更新も、omikujiStore のメソッド経由で行う
  // comments の PostActionSchema の characterKey を更新
  const commentsData = omikujiStore.getCategoryMap<CommentRuleType>('comments');
  Object.entries(commentsData).forEach(([ruleId, commentRule]) => {
   const updatedOmikuji = commentRule.omikuji.map((omikujiSet) => {
    const updatedPostActions = omikujiSet.postActions.map((postAction) => {
     return postAction.characterKey === oldId ? { ...postAction, characterKey: newId } : postAction;
    });
    return { ...omikujiSet, postActions: updatedPostActions };
   });
   omikujiStore.updateItem('comments', ruleId, {
    ...commentRule,
    omikuji: updatedOmikuji
   });
  });

  // timers の PostActionSchema の characterKey を更新
  const timersData = omikujiStore.getCategoryMap<TimerRuleType>('timers');
  Object.entries(timersData).forEach(([ruleId, timerRule]) => {
   const updatedOmikuji = timerRule.omikuji.map((omikujiSet) => {
    const updatedPostActions = omikujiSet.postActions.map((postAction) => {
     return postAction.characterKey === oldId ? { ...postAction, characterKey: newId } : postAction;
    });
    return { ...omikujiSet, postActions: updatedPostActions };
   });
   omikujiStore.updateItem('timers', ruleId, { ...timerRule, omikuji: updatedOmikuji });
  });

  if (omikujiStore.selectedCategory === 'characters' && omikujiStore.selectedRuleId === oldId) {
   omikujiStore.selectRule(newId);
  }
  return true;
 };

 // 指定されたキャラクターIDがどこで使用されているかを取得
 const getCharacterUsage = (characterId: string) => {
  const usage = {
   comments: [] as string[],
   timers: [] as string[]
  };

  // comments での使用箇所を検索
  Object.entries(omikujiStore.data.comments).forEach(([ruleId, commentRule]) => {
   const hasUsage = commentRule.omikuji.some((omikujiSet) =>
    omikujiSet.postActions.some((postAction) => postAction.characterKey === characterId)
   );
   if (hasUsage) {
    usage.comments.push(ruleId);
   }
  });

  // timers での使用箇所を検索
  Object.entries(omikujiStore.data.timers).forEach(([ruleId, timerRule]) => {
   const hasUsage = timerRule.omikuji.some((omikujiSet) =>
    omikujiSet.postActions.some((postAction) => postAction.characterKey === characterId)
   );
   if (hasUsage) {
    usage.timers.push(ruleId);
   }
  });

  return usage;
 };

 // 使用されていないキャラクターを取得
 const getUnusedCharacters = () => {
  const allCharacterIds = Object.keys(baseOperations.rulesMap.value);
  const usedCharacterIds = new Set<string>();

  // comments で使用されているキャラクターを収集
  Object.values(omikujiStore.data.comments).forEach((commentRule: CommentRuleType) => {
   commentRule.omikuji.forEach((omikujiSet) => {
    omikujiSet.postActions.forEach((postAction) => {
     if (postAction.characterKey) {
      usedCharacterIds.add(postAction.characterKey);
     }
    });
   });
  });

  // timers で使用されているキャラクターを収集
  Object.values(omikujiStore.data.timers).forEach((timerRule: TimerRuleType) => {
   timerRule.omikuji.forEach((omikujiSet) => {
    omikujiSet.postActions.forEach((postAction) => {
     if (postAction.characterKey) {
      usedCharacterIds.add(postAction.characterKey);
     }
    });
   });
  });

  return allCharacterIds.filter((id) => !usedCharacterIds.has(id));
 };

 return {
  ...baseOperations,
  updateCharacterId,
  getCharacterUsage,
  getUnusedCharacters
 };
});
