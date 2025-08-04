// src/componentConfig.ts
import { GameComponentConfig } from '@/types/GameComponent/GameRankingTypes';

export const componentConfig: GameComponentConfig = {
 textColors: {
  primary: '',
  secondary: '',
  accent: ''
 },
 backgrounds: {
  base: '',
  ranking: {
   first: '',
   second: '',
   third: '',
   oddRow: '',
   evenRow: ''
  }
 },
 fontStyles: {
  scoreText: '',
  rankingText: ''
 },
 scoreDisplay: {
  scoreIcon: {
   iconName: '',
   iconColor: '',
   customClass: ''
  },
  scoreAnimation: 'bounce'
 },
 displaySettings: {
  titleText: '🍉スイカランキング🍉',
  highlightTopThree: true,
  scoreFormat: ''
 }
};
