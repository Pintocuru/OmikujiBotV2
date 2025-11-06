// src/componentConfig.ts
import { GameComponentConfig } from '@/types/GameComponent/GameRankingTypes';

export const componentConfig: GameComponentConfig = {
 textColors: {
  primary: 'text-stone-700',
  secondary: 'text-stone-600',
  accent: 'text-amber-800'
 },
 backgrounds: {
  base: 'bg-amber-50 border-4 border-amber-400',
  ranking: {
   first: 'text-amber-800 bg-gradient-to-r from-amber-200 to-amber-100 border-l-4 border-amber-400',
   second: 'text-blue-800 bg-gradient-to-r from-blue-200 to-blue-100 border-l-4 border-blue-400',
   third:
    'text-orange-800 bg-gradient-to-r from-orange-200 to-orange-100 border-l-4 border-orange-400',
   oddRow: 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-300',
   evenRow: 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-300'
  }
 },
 fontStyles: {
  scoreText: 'font-mochiy',
  rankingText: 'font-rocknroll'
 },
 scoreDisplay: {
  scoreIcon: {
   iconName: 'Sparkles',
   iconColor: 'text-blue-400/30',
   customClass: 'bg-white/60 p-4'
  },
  scoreAnimation: 'bounce'
 },
 displaySettings: {
  titleText: '🍉スイカランキング🍉',
  highlightTopThree: true,
  scoreFormat: '<<points>> (<<name>>)'
 }
};
