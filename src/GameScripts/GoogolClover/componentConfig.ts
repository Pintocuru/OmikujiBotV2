// src/componentConfig.ts
import { GameComponentConfig } from '@/types/GameComponent/GameRankingTypes';

export const componentConfig: GameComponentConfig = {
 textColors: {
  primary: 'text-yellow-400',
  secondary: 'text-stone-100',
  accent: 'text-red-500'
 },
 backgrounds: {
  base: 'bg-gradient-to-br from-stone-900 via-gray-800 to-stone-950 border-4 border-stone-700',
  ranking: {
   first: 'bg-gradient-to-r from-amber-300 to-orange-400 text-stone-800 border-amber-300',
   second: 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800 border-gray-400',
   third: 'bg-gradient-to-r from-orange-400 to-red-600 text-stone-800 border-orange-400',
   oddRow: 'text-amber-300 bg-red-800 bg-opacity-70 border-amber-300',
   evenRow: 'text-amber-300 bg-stone-800 bg-opacity-70 border-orange-400'
  }
 },
 fontStyles: {
  scoreText: 'font-rocknroll',
  rankingText: 'font-rocknroll'
 },
 scoreDisplay: {
  scoreIcon: {
   iconName: 'Bomb',
   iconColor: 'text-red-700',
   customClass: 'bg-red-900'
  },
  scoreAnimation: 'bounce'
 },
 displaySettings: {
  titleText: '💣 Bomber Slot Rankings 💥',
  highlightTopThree: true,
  scoreFormat: '<<points>> [<<itemValue1>>] (<<name>>)'
 }
};
