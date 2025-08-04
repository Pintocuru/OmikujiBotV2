// src/MainGenerator/components/GameRankingViewer/useGameRanking.ts
import { computed } from 'vue';
import type { GameComponentConfig, GameStatistics, UserStatsType } from '@/types';

export function useGameRanking(
 userRankingsRaw: UserStatsType[],
 optionRaw: GameComponentConfig | null
) {
 // computed
 const userRankings = computed(() => userRankingsRaw);
 const options = computed(() => optionRaw);

 // Computed game statistics
 const gameStatistics = computed<GameStatistics>(() => {
  const players = userRankings.value || [];
  const totalScore = players.reduce((sum, player) => sum + player.points, 0);

  return {
   totalScore,
   averageScore: players.length > 0 ? Math.round(totalScore / players.length) : 0,
   totalCount: players.length
  };
 });

 // Ranking row class generator
 const getRankingRowClass = (index: number): string[] => {
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

  switch (index) {
   case 0:
    return [...baseClasses, ranking.first];
   case 1:
    return [...baseClasses, ranking.second];
   case 2:
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
 };

 return {
  // Data
  gameStatistics,

  // Methods
  getRankingRowClass,
  getRankingNumberClass
 };
}
