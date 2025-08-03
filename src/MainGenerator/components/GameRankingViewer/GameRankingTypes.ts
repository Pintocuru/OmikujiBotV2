// shared/utils/rankComponent/GameRankingTypes.ts

export interface GameStatistics {
 averageScore: number;
 totalScore: number;
 totalCount: number;
}

export type ScoreAnimationType =
 | 'bounce'
 | 'fadeInUp'
 | 'zoomIn'
 | 'pulse'
 | 'slideInDown'
 | 'rotateIn'
 | 'flipInY'
 | 'rubberBand'
 | 'jello'
 | 'heartBeat';

export interface ScoreDisplayBackground {
 // lucide-vue-next アイコン使用の場合
 icon?: {
  name: string;
  size?: number;
  color?: string;
  className?: string;
 };
 // SVG背景使用の場合
 svg?: {
  src: string;
  className?: string;
 };
 // 通常の背景クラス
 className?: string;
}

export interface GameRankingTheme {
 // Color scheme
 text: {
  primary: string;
  secondary: string;
  accent: string;
 };
 background: {
  container: string;
  ranking: {
   first: string;
   second: string;
   third: string;
   oddRow: string;
   evenRow: string;
  };
  // スコア表示用背景
  scoreDisplay?: ScoreDisplayBackground;
 };

 // Typography
 fontClass: {
  scoreDisplay: string;
  rankingDisplay: string;
 };

 // Score Display Animation
 scoreAnimation: ScoreAnimationType;
}
