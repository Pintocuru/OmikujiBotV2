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
  },
  scoreIcon: {
   iconName: '',
   iconColor: '',
   customClass: ''
  }
 },
 fontStyles: {
  scoreText: '',
  rankingText: ''
 },
 scoreAnimation: 'bounce',
 displaySettings: {
  titleText: '💣 Bomber Slot Rankings 💥',
  highlightTopThree: true,
  scoreFormat: ''
 }
};
