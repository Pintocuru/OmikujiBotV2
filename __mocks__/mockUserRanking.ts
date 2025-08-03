//
import { UserStatsType } from '../src/types/GameScript/GameScriptSchema';

// モックデータ
const getRandomInt = (min: number, max: number) =>
 Math.floor(Math.random() * (max - min + 1)) + min;

const baseNames = [
 'あい',
 'しろ',
 'けん',
 'さくら',
 'みお',
 'そら',
 'なな',
 'たける',
 'りょう',
 'ゆき'
];

/**
 * 任意の数のモックユーザーデータを生成
 * @param count - 生成するユーザー数（省略時は baseNames.length）
 */
export function generateMockUserRankingData(count: number = baseNames.length): UserStatsType[] {
 return Array.from({ length: count }, (_, index) => {
  const name = baseNames[index] ?? `ユーザー${index + 1}`;
  const rank = index + 1;
  const basePoints = getRandomInt(650, 1350);
  const draws = getRandomInt(5, 20);
  const wins = getRandomInt(4, 15);
  const totalPoints = basePoints + getRandomInt(100, 400);
  const rate = getRandomInt(60, 90);

  return {
   name,
   userId: `user${(rank + 1000).toString().slice(1)}`,
   points: basePoints,
   draws,
   wins,
   totalPoints,
   rank,
   rate
  };
 });
}
