// src/componentConfig.ts
import { GameComponentConfig } from '@/types/GameComponent/GameRankingTypes';

export const componentConfig: GameComponentConfig = {
 textColors: {
  primary: 'text-amber-100',
  secondary: 'text-amber-200',
  accent: 'text-orange-300'
 },
 backgrounds: {
  base: 'bg-gradient-to-br from-stone-900 via-gray-800 to-amber-900',
  ranking: {
   first: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
   second: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
   third: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
   oddRow: 'bg-stone-800 bg-opacity-40',
   evenRow: 'bg-stone-700 bg-opacity-50'
  }
 },
 fontStyles: {
  scoreText: 'font-rocknroll',
  rankingText: 'font-rocknroll'
 },
 scoreDisplay: {
  scoreIcon: {
   iconName: 'Pickaxe',
   iconColor: 'text-amber-700',
   customClass: 'bg-amber-900'
  },
  scoreAnimation: 'slideInDown'
 },
 displaySettings: {
  titleText: '⛏️ きょうのうさぎランキング 💎',
  highlightTopThree: true,
  scoreFormat: ''
 }
};
