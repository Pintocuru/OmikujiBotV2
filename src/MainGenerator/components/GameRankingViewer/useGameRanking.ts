// shared/utils/rankComponent/useGameRanking.ts
import { computed } from 'vue';
import { RankComponentConfig, UserStatsType } from '@shared/types/';
import { GameStatistics } from './GameRankingTypes';
import { getTheme } from './ThemePresets';

export function useGameRanking(userRankingsRaw: UserStatsType[], optionRaw: RankComponentConfig) {
 // computed
 const userRankings = computed(() => userRankingsRaw);
 const options = computed(() => optionRaw);

 const theme = computed(() => getTheme(options.value.themeName));

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

  if (!options.value.useRankingBackgrounds) {
   switch (index) {
    case 0:
     return [...baseClasses, theme.value.background.ranking.first];
    default:
     // 偶数奇数でクラスを切り替え
     return [
      ...baseClasses,
      index % 2 === 0
       ? theme.value.background.ranking.evenRow
       : theme.value.background.ranking.oddRow
     ];
   }
  }

  switch (index) {
   case 0:
    return [...baseClasses, theme.value.background.ranking.first];
   case 1:
    return [...baseClasses, theme.value.background.ranking.second];
   case 2:
    return [...baseClasses, theme.value.background.ranking.third];
   default:
    // 偶数奇数でクラスを切り替え
    return [
     ...baseClasses,
     index % 2 === 0
      ? theme.value.background.ranking.evenRow
      : theme.value.background.ranking.oddRow
    ];
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
  theme,
  gameStatistics,

  // Methods
  getRankingRowClass,
  getRankingNumberClass
 };
}
