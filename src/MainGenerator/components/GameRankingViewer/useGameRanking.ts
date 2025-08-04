// src/MainGenerator/components/GameRankingViewer/useGameRanking.ts
import { computed } from 'vue';
import type { GameComponentConfig, GameStatistics, UserStatsType } from '@/types';

export function useGameRanking(
 userRankingsRaw: UserStatsType[],
 optionRaw: GameComponentConfig | null
) {
 // computed - null安全性を確保
 const userRankings = computed(() => userRankingsRaw || []);
 const options = computed(() => optionRaw);

 // Computed game statistics
 const gameStatistics = computed<GameStatistics>(() => {
  const players = userRankings.value;
  if (!players || players.length === 0) {
   return {
    totalScore: 0,
    averageScore: 0,
    totalCount: 0
   };
  }

  const totalScore = players.reduce((sum, player) => sum + (player.points ?? 0), 0);

  return {
   totalScore,
   averageScore: players.length > 0 ? Math.round(totalScore / players.length) : 0,
   totalCount: players.length
  };
 });

 // プレイヤー情報のフォーマット処理
 const formatPlayerInfo = (player: UserStatsType, scoreFormat: string): string => {
  if (!scoreFormat) return `${player.points ?? 0} pt (${player.name})`;

  return scoreFormat
   .replace(/<<points>>/g, String(player.points ?? 0))
   .replace(/<<name>>/g, player.name || '')
   .replace(/<<rank>>/g, String(player.rank ?? '-')) // 順位がない場合はハイフン
   .replace(/<<totalPoints>>/g, String(player.totalPoints ?? 0))
   .replace(/<<wins>>/g, String(player.wins ?? 0))
   .replace(/<<draws>>/g, String(player.draws ?? 0))
   .replace(/<<rate>>/g, player.rate != null ? `${Math.round(player.rate * 100)}%` : '0%')
   .replace(/<<itemValue1>>/g, player.itemValue1 || '')
   .replace(/<<itemValue2>>/g, player.itemValue2 || '')
   .replace(/<<itemValue3>>/g, player.itemValue3 || '')
   .replace(/<<priority>>/g, String(player.priority ?? 0));
 };

 // Ranking row class generator
 const getRankingRowClass = (index: number): string[] => {
  if (!options.value) return ['flex', 'items-center', 'justify-between', 'p-2'];

  const baseClasses = [
   'flex',
   'items-center',
   'justify-between',
   'p-2',
   'rounded-lg',
   'border-2',
   'border-opacity-30',
   'relative',
   'overflow-hidden'
  ];

  const ranking = options.value.backgrounds.ranking;

  if (!options.value.displaySettings?.highlightTopThree) {
   return [...baseClasses, index % 2 === 0 ? ranking.evenRow : ranking.oddRow];
  }

  // highlightTopThree=trueの場合、player.rankを使用
  const player = userRankings.value[index];
  const playerRank = player?.rank ?? index + 1;

  switch (playerRank) {
   case 1:
    return [...baseClasses, ranking.first];
   case 2:
    return [...baseClasses, ranking.second];
   case 3:
    return [...baseClasses, ranking.third];
   default:
    return [...baseClasses, index % 2 === 0 ? ranking.evenRow : ranking.oddRow];
  }
 };

 // Ranking number class generator
 const getRankingNumberClass = (index: number, sizeClass: string): string[] => {
  const baseClasses = [
   'inline-flex',
   'items-center',
   'justify-center',
   'rounded-full',
   'font-bold',
   'border-2',
   'mr-3',
   sizeClass
  ];

  if (!options.value?.displaySettings?.highlightTopThree) {
   // 通常表示の場合はindexベース
   const medalColors = {
    0: ['bg-yellow-400', 'text-yellow-900', 'border-yellow-600'],
    1: ['bg-gray-300', 'text-gray-800', 'border-gray-500'],
    2: ['bg-amber-600', 'text-amber-100', 'border-amber-800']
   };

   return [
    ...baseClasses,
    ...(medalColors[index as keyof typeof medalColors] || [
     'bg-blue-500',
     'text-white',
     'border-blue-700'
    ])
   ];
  }

  // highlightTopThree=trueの場合、player.rankを使用
  const player = userRankings.value[index];
  const playerRank = player?.rank ?? index + 1;

  const medalColors = {
   1: ['bg-yellow-400', 'text-yellow-900', 'border-yellow-600'], // 1位
   2: ['bg-gray-300', 'text-gray-800', 'border-gray-500'], // 2位
   3: ['bg-amber-600', 'text-amber-100', 'border-amber-800'] // 3位
  };

  return [
   ...baseClasses,
   ...(medalColors[playerRank as keyof typeof medalColors] || [
    'bg-blue-500',
    'text-white',
    'border-blue-700'
   ])
  ];
 };

 return {
  // Data
  gameStatistics,
  userRankings,
  options,

  // Methods
  formatPlayerInfo,
  getRankingRowClass,
  getRankingNumberClass
 };
}
