// src/services/PlaceholderService.ts
import { GamePlaceholder, GamePlaceholderSchema } from '../params';
import { RankingService } from './RankingService';
import { GameContext } from '../GameContext';

export class PlaceholderService {
 // 引数を1つのコンテキストオブジェクトに集約
 static createPlaceholders(context: GameContext): GamePlaceholder {
  const { settings, gameState, currentUser } = context;
  const userStats = gameState.userStats[currentUser.id];

  const currentDraws = userStats?.draws ?? 0;
  const isOverLimit = settings.enableCount > 0 && currentDraws > settings.enableCount;

  return settings.rankMode === 'point'
   ? this.createPointModePlaceholders(context, isOverLimit)
   : this.createWinnerModePlaceholders(context, isOverLimit);
 }

 private static createPointModePlaceholders(
  context: GameContext,
  isOverLimit: boolean
 ): GamePlaceholder {
  const { gameState, currentUser } = context;
  const userRecords = gameState.userRecords?.[currentUser.id] || [];
  const latestRecord = userRecords[userRecords.length - 1];

  if (latestRecord) {
   const rank = RankingService.calculateRank(context, latestRecord);

   return {
    announceMessage: isOverLimit
     ? `${latestRecord.name}さんは上限を超えているから、参考記録だよ。`
     : `${latestRecord.name}さんの${latestRecord.points}は、${rank}位だよ。`,
    winsCount: latestRecord.wins ?? 0,
    winsRank: rank,
    winsRate: '0.0',
    totalDraws: userRecords.length,
    totalPoints: gameState.userStats[currentUser.id]?.totalPoints ?? 0
   };
  }

  return GamePlaceholderSchema.parse({});
 }

 private static createWinnerModePlaceholders(
  context: GameContext,
  isOverLimit: boolean
 ): GamePlaceholder {
  const { gameState, currentUser } = context;
  const userStats = gameState.userStats[currentUser.id];
  const currentDraws = userStats?.draws ?? 0;

  const rank = RankingService.calculateRank(context, userStats);
  const winRate =
   currentDraws > 0 ? (((userStats?.wins || 0) / currentDraws) * 100).toFixed(1) : '0.0';

  return {
   announceMessage: isOverLimit
    ? `${userStats?.name}さんは上限を超えているから、参考記録だよ。`
    : `${userStats?.name}さんの順位は、${rank}位だよ。`,
   winsCount: userStats?.wins ?? 0,
   winsRank: rank,
   winsRate: winRate,
   totalDraws: currentDraws,
   totalPoints: userStats?.totalPoints ?? 0
  };
 }
}
