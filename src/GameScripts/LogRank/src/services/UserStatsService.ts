// src/services/UserStatsService.ts
import { UserStatsTypeSchema } from '@shared/types/';
import { UserStatsType } from '@shared/types/';
import { GameContext } from '../GameContext';

export class UserStatsService {
 static updateUserStats(context: GameContext): Record<string, UserStatsType> {
  return context.settings.rankMode === 'point'
   ? this.updatePointModeStats(context)
   : this.updateWinnerModeStats(context);
 }

 /**
  * ポイントモード: 1ゲームの記録を管理
  */
 private static updatePointModeStats(context: GameContext): Record<string, UserStatsType> {
  const { gameState, currentUser, params } = context;
  const { getPoint, itemValue1, itemValue2, itemValue3 } = params;

  if (!gameState.userRecords) {
   gameState.userRecords = {};
  }
  if (!gameState.userRecords[currentUser.id]) {
   gameState.userRecords[currentUser.id] = [];
  }

  const newRecord: UserStatsType = UserStatsTypeSchema.parse({
   userId: currentUser.id,
   name: currentUser.name,
   draws: 1,
   wins: 0,
   points: getPoint,
   totalPoints: getPoint,
   ...(itemValue1 && { itemValue1 }),
   ...(itemValue2 && { itemValue2 }),
   ...(itemValue3 && { itemValue3 })
  });

  gameState.userRecords[currentUser.id].push(newRecord); // userStatsも更新

  const updatedUserStats: UserStatsType = {
   userId: currentUser.id,
   name: currentUser.name,
   draws: gameState.userRecords[currentUser.id].length,
   wins: 0,
   points: getPoint,
   totalPoints: gameState.userRecords[currentUser.id].reduce(
    (sum, record) => sum + (record.points ?? 0),
    0
   ),
   rank: 0,
   rate: 0,
   ...(itemValue1 && { itemValue1 }),
   ...(itemValue2 && { itemValue2 }),
   ...(itemValue3 && { itemValue3 })
  };

  return { ...gameState.userStats, [currentUser.id]: updatedUserStats };
 }

 /**
  * 勝数モード: ユーザーごとの記録を管理
  */
 private static updateWinnerModeStats(context: GameContext): Record<string, UserStatsType> {
  const { gameState, currentUser, params } = context;
  const { isWin, getPoint, itemValue1, itemValue2, itemValue3 } = params; // 現在の統計を取得または初期化

  const current =
   gameState.userStats[currentUser.id] ??
   UserStatsTypeSchema.parse({
    userId: currentUser.id,
    name: currentUser.name,
    draws: 0
   });

  const updated: UserStatsType = { ...current }; // 統計を更新

  if (getPoint > 0) {
   updated.points = (updated.points || 0) + getPoint;
   updated.totalPoints = (updated.totalPoints || 0) + getPoint;
  }
  if (isWin) updated.wins = (updated.wins || 0) + 1;
  updated.draws = (updated.draws || 0) + 1;

  if (itemValue1) updated.itemValue1 = itemValue1;
  if (itemValue2) updated.itemValue2 = itemValue2;
  if (itemValue3) updated.itemValue3 = itemValue3;

  return { ...gameState.userStats, [currentUser.id]: updated };
 }
}
