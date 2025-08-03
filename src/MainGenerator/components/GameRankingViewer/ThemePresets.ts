// shared/utils/rankComponent/ThemePresets.ts
import { GameRankingTheme } from './GameRankingTypes';

export const gameRankingThemeLabel = [
 'ocean',
 'caveMining',
 'GouseiSuika',
 'halloween',
 'crimsonFury'
] as const;
export type GameRankingThemeLabel = (typeof gameRankingThemeLabel)[number];

const themes: Record<GameRankingThemeLabel, GameRankingTheme> = {
 ocean: {
  text: {
   primary: 'text-blue-100',
   secondary: 'text-blue-200',
   accent: 'text-cyan-300'
  },
  background: {
   container: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900',
   ranking: {
    first: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
    second: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
    third: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
    oddRow: 'bg-blue-800 bg-opacity-40',
    evenRow: 'bg-blue-700 bg-opacity-50'
   }
  },
  fontClass: {
   scoreDisplay: 'font-rocknroll',
   rankingDisplay: 'font-sans'
  },
  scoreAnimation: 'bounce'
 },
 caveMining: {
  text: {
   primary: 'text-amber-100',
   secondary: 'text-amber-200',
   accent: 'text-orange-300'
  },
  background: {
   container: 'bg-gradient-to-br from-stone-900 via-gray-800 to-amber-900',
   ranking: {
    first: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
    second: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
    third: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
    oddRow: 'bg-stone-800 bg-opacity-40',
    evenRow: 'bg-stone-700 bg-opacity-50'
   }
  },
  fontClass: {
   scoreDisplay: 'font-mono',
   rankingDisplay: 'font-sans'
  },
  scoreAnimation: 'slideInDown'
 },
 GouseiSuika: {
  text: {
   primary: 'text-green-100',
   secondary: 'text-green-200',
   accent: 'text-lime-300'
  },
  background: {
   container: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900',
   ranking: {
    first: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
    second: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
    third: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
    oddRow: 'bg-green-800 bg-opacity-40',
    evenRow: 'bg-green-700 bg-opacity-50'
   }
  },
  fontClass: {
   scoreDisplay: 'font-rocknroll',
   rankingDisplay: 'font-sans'
  },
  scoreAnimation: 'bounce'
 },
 halloween: {
  text: {
   primary: 'text-orange-100',
   secondary: 'text-orange-200',
   accent: 'text-yellow-300'
  },
  background: {
   container: 'bg-gradient-to-br from-purple-900 via-orange-900 to-black',
   ranking: {
    first: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
    second: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
    third: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
    oddRow: 'bg-purple-800 bg-opacity-40',
    evenRow: 'bg-orange-800 bg-opacity-50'
   }
  },
  fontClass: {
   scoreDisplay: 'font-rocknroll',
   rankingDisplay: 'font-sans'
  },
  scoreAnimation: 'pulse'
 },
 crimsonFury: {
  text: {
   primary: 'text-red-100',
   secondary: 'text-red-200',
   accent: 'text-pink-300'
  },
  background: {
   container: 'bg-gradient-to-br from-red-900 via-crimson-800 to-black',
   ranking: {
    first: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
    second: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
    third: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
    oddRow: 'bg-red-800 bg-opacity-40',
    evenRow: 'bg-red-700 bg-opacity-50'
   }
  },
  fontClass: {
   scoreDisplay: 'font-rocknroll',
   rankingDisplay: 'font-sans'
  },
  scoreAnimation: 'zoomIn'
 }
};

export function getTheme(themeName: GameRankingThemeLabel): GameRankingTheme {
 console.log('getTheme called with:', themeName);
 console.log('Available themes:', Object.keys(themes));

 const selectedTheme = themes[themeName];

 if (!selectedTheme) {
  console.error(`Theme '${themeName}' not found. Available themes:`, Object.keys(themes));
  console.log('Falling back to ocean theme');
  return themes.ocean;
 }

 console.log('Successfully retrieved theme:', themeName, selectedTheme);

 // Tailwind クラスの検証
 const backgroundClasses = [
  selectedTheme.background.container,
  selectedTheme.background.ranking.first,
  selectedTheme.background.ranking.second,
  selectedTheme.background.ranking.third,
  selectedTheme.background.ranking.oddRow,
  selectedTheme.background.ranking.evenRow
 ];

 console.log('Theme background classes:', backgroundClasses);

 // 無効なクラスがないかチェック
 const invalidClasses = backgroundClasses.filter((cls) => !cls || typeof cls !== 'string');
 if (invalidClasses.length > 0) {
  console.warn('Invalid background classes found:', invalidClasses);
 }

 return selectedTheme;
}

// テーマの一覧を取得する関数
export function getAvailableThemes(): GameRankingThemeLabel[] {
 return Object.keys(themes) as GameRankingThemeLabel[];
}

// テーマが存在するかチェックする関数
export function isValidTheme(themeName: string): themeName is GameRankingThemeLabel {
 return themeName in themes;
}
