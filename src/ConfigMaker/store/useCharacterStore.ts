// src/ConfigMaker/script/useCharacterStore.ts - キャラクター専用ストア
import { CommentRuleType, TimerRuleType } from '@type/';
import { useRecordOperations } from './useRecordStore';
import { useOmikujiStore } from './useOmikujiStore';
import { defineStore } from 'pinia';

export const useCharacterStore = defineStore('characterRules', () => {
 const baseOperations = useRecordOperations('characters');
 const omikujiStore = useOmikujiStore();

 // キャラクターIDを更新し、関連する参照も更新する
 const updateCharacterId = (oldId: string, newId: string): boolean => {
  const data = baseOperations.rulesMap.value;
  const character = data[oldId];

  if (!character) {
   return false;
  }

  // 1. 新しいIDでキャラクターを作成
  const updatedCharacter = {
   ...character,
   id: newId
  };

  // 2. 新しいIDでキャラクターを追加
  data[newId] = updatedCharacter;

  // 3. 古いIDのキャラクターを削除
  delete data[oldId];

  // 4. comments の PostActionSchema の characterKey を更新
  const commentsData = omikujiStore.data.comments;
  Object.values(commentsData).forEach((commentRule: CommentRuleType) => {
   commentRule.omikuji.forEach((omikujiSet) => {
    omikujiSet.postActions.forEach((postAction) => {
     if (postAction.characterKey === oldId) {
      postAction.characterKey = newId;
     }
    });
   });
  });

  // 5. timers の PostActionSchema の characterKey を更新
  const timersData = omikujiStore.data.timers;
  Object.values(timersData).forEach((timerRule: TimerRuleType) => {
   timerRule.omikuji.forEach((omikujiSet) => {
    omikujiSet.postActions.forEach((postAction) => {
     if (postAction.characterKey === oldId) {
      postAction.characterKey = newId;
     }
    });
   });
  });

  // 6. 現在選択されているルールが更新対象の場合、選択を更新
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
  // 基本操作は全てuseRecordOperationsから
  ...baseOperations,

  // キャラクター専用の機能
  updateCharacterId,
  getCharacterUsage,
  getUnusedCharacters
 };
});
