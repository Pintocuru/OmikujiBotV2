// src/types/GameComponent/GameRankingTypes.ts
使わない

// GameRankingScoreで使用するスコア表示設定
export interface GameRankingScore {
 scoreIcon: ScoreIcon;
 scoreAnimation: ScoreAnimationType;
}

export interface ScoreIcon {
 iconName: string; // アイコン名（lucide）
 iconColor: string; // アイコン色
 customClass?: string; // オプションのCSSクラス
}

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
 };

 // Typography
 fontStyles: {
  scoreText: string;
  rankingText: string;
  // 動的に追加されるスタイルオブジェクト
  scoreTextStyle?: Record<string, string>;
  rankingTextStyle?: Record<string, string>;
 };

 // スコア表示設定（GameRankingScoreで使用）
 scoreDisplay: GameRankingScore;

 // コンポーネント表示設定
 displaySettings: {
  titleText: string; // ランキング表のタイトル名
  highlightTopThree?: boolean; // 1-3位の表記にするか
  scoreFormat: string; // スコアの表示方法(<<name>> の形で記入)
 };
}
