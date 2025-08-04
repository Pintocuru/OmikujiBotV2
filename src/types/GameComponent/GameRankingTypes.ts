// src/types/GameComponent/GameRankingTypes.ts

// コンポーネントを表示する要素を１つにまとめる

// スコア表示のアニメーションの種類
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

export interface ScoreIcon {
 iconName: string; // アイコン名（lucide）
 iconColor: string; // アイコン色
 customClass?: string; // オプションのCSSクラス
}

export interface GameComponentConfig {
 // Color scheme
 textColors: {
  primary: string;
  secondary: string;
  accent: string;
 };
 backgrounds: {
  base: string; // ボードの背景
  ranking: {
   first: string; // 1位、または最新プレイヤー
   second: string; // 2位
   third: string; // 3位
   oddRow: string; // それ以外の奇数
   evenRow: string; // それ以外の偶数
  };
  // スコア表示用背景
  scoreIcon: ScoreIcon;
 };

 // Typography
 // TODO:Googleフォントからの動的な取得
 fontStyles: {
  scoreText: string;
  rankingText: string;
 };

 // Score Display Animation
 scoreAnimation: ScoreAnimationType;

 // コンポーネント表示設定
 displaySettings: {
  titleText: string; // ランキング表のタイトル名
  highlightTopThree?: boolean; // 1-3位の表記にするか
  scoreFormat: string; // スコアの表示方法(<<name>> の形で記入)
 };
}
