// src/execute.ts
// ユーザーの項目データ・ランキングを管理するゲームシステム
import {
 GameSettings,
 GameParams,
 UserRankingType,
 GamePlaceholder,
 GameStatePlus
} from './params';
import { ScriptResult, ScriptClass } from '@shared/types/GameScriptTypes';
import { GameStateSchema } from '@shared/types/GameScriptSchema';

import { Comment } from '@onecomme.com/onesdk/types/Comment';

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
 private settings: GameSettings = {};
 private gameState: GameState = GameStateSchema.parse({ ruleId: 'LogList' });

 setup(settings: GameSettings): void {
  this.settings = settings;
 }

 run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder, UserRankingType> {
  try {
   const userId = comment.data.userId;
   const userStats = this.updateUserStats(userId, comment.data.name, params);
   const rankings = this.generateRankings(userStats, params, userId);

   this.gameState = { ...this.gameState, userStats, rankings };

   return {
    placeholders: this.createPlaceholders(userStats[userId], rankings, userId, params),
    postActions: [],
    rankingList: rankings
   };
  } catch (error) {
   console.error('Game execution error:', error);
   throw new Error('ゲーム実行中にエラーが発生しました');
  }
 }

 private updateUserStats(
  userId: string,
  userName: string,
  params: GameParams
 ): Record<string, UserRankingType> {
  const current = this.gameState.userStats[userId] ?? {
   userId,
   name: userName,
   draws: 0,
   itemValue1: '',
   itemValue2: '',
   itemValue3: '',
   priority: 0
  };

  const updated: UserRankingType = {
   ...current,
   draws: (current.draws || 0) + 1,
   itemValue1: params.itemValue1,
   itemValue2: params.itemValue2,
   itemValue3: params.itemValue3,
   priority: params.priority
  };

  return { ...this.gameState.userStats, [userId]: updated };
 }

 private generateRankings(
  userStats: Record<string, UserRankingType>,
  params: GameParams,
  userId: string
 ): UserRankingType[] {
  // 上限回数チェック(0であれば回数制限なし)
  if (params.enableCount > 0 && params.enableCount < userStats[userId].draws) {
   return this.gameState.rankings || [];
  }

  // 全ユーザーのランキングエントリを作成
  const entries = this.createRankingEntries(userStats);

  // 優先度の高い順でソート
  const sorted = entries
   .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
   .map((entry, index) => ({ ...entry, rank: index + 1 }));

  // 現在ユーザーを先頭に移動
  const currentIndex = sorted.findIndex((entry) => entry.userId === userId);
  if (currentIndex > 0) {
   const [currentUser] = sorted.splice(currentIndex, 1);
   sorted.unshift(currentUser);
  }

  return sorted;
 }

 private createRankingEntries(userStats: Record<string, UserRankingType>): UserRankingType[] {
  const previousRankings = this.gameState.rankings || [];

  return Object.entries(userStats).map(([uid, stats]) => {
   const prev = previousRankings.find((entry) => entry.userId === uid);
   const draws = stats.draws ?? prev?.draws ?? 0;

   return {
    userId: uid,
    name: stats.name || 'Unknown',
    draws,
    itemValue1: stats.itemValue1 ?? prev?.itemValue1 ?? '',
    itemValue2: stats.itemValue2 ?? prev?.itemValue2 ?? '',
    itemValue3: stats.itemValue3 ?? prev?.itemValue3 ?? '',
    priority: stats.priority ?? prev?.priority ?? 0
   };
  });
 }

 private createPlaceholders(
  userStats: UserRankingType,
  rankings: UserRankingType[],
  userId: string,
  params: GameParams
 ): GamePlaceholder {
  const isOverLimit = params.enableCount > 0 && params.enableCount < userStats.draws;
  const rank = this.calculateRank(userStats, rankings, userId);

  return {
   announceMessage: isOverLimit
    ? `${userStats.name}さんは上限を超えているから、参考記録だよ。`
    : `${userStats.name}さんの順位は、${rank}位だよ。`,
   winsRank: rank,
   totalDraws: String(userStats.draws ?? 0)
  };
 }

 private calculateRank(
  userStats: UserRankingType,
  rankings: UserRankingType[],
  userId: string
 ): string {
  const index = rankings.findIndex((rank) => rank.userId === userId);
  return index >= 0 ? String(index + 1) : '不明';
 }
}

const execute = new ExecuteScript();
export default execute;
