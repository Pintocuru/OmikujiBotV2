<!-- src/MainGenerator/components/GameRankingViewer/GameRankingDisplay.vue -->
<template>
 <div
  v-if="theme"
  :class="['p-1 rounded-2xl', theme.backgrounds.base, theme.fontStyles.rankingText]"
 >
  <!-- ランキングタイトル -->
  <div
   :class="[
    'text-center mb-2 font-bold drop-shadow-lg',
    theme.textColors.accent,
    sizeConfig.text.large
   ]"
   :style="getFontStyleForRanking(theme.fontStyles.rankingText)"
  >
   {{ theme.displaySettings.titleText }}
  </div>

  <!-- ランキングリスト -->
  <div class="overflow-hidden max-h-fit">
   <ul class="list-none p-0 m-0 space-y-1">
    <li
     v-for="(player, index) in userRankings"
     :key="`${player.userId}-${index}`"
     :class="getRankingRowClass(index)"
    >
     <!-- 順位 -->
     <span :class="getRankingNumberClass(index, sizeConfig.rankingNumber)">
      {{ player.rank ?? index + 1 }}
     </span>

     <!-- プレイヤー情報 -->
     <span class="flex justify-center items-center flex-1">
      <span
       :class="[theme.textColors.primary, sizeConfig.text.medium]"
       :style="getFontStyleForRanking(theme.fontStyles.rankingText)"
       v-html="formatPlayerInfo(player, theme.displaySettings.scoreFormat)"
      />
     </span>
    </li>
   </ul>
  </div>

  <!-- 平均スコア -->
  <div
   :class="[
    'p-0 m-0 flex justify-center items-center w-full mt-2',
    theme.textColors.primary,
    sizeConfig.text.small
   ]"
   :style="getFontStyleForRanking(theme.fontStyles.rankingText)"
  >
   平均: {{ gameStatistics.averageScore }}pt ({{ gameStatistics.totalCount }}回 / 総計{{
    gameStatistics.totalScore
   }}pt)
  </div>

  <!-- スコアテンプレート表示（処理前） -->
  <div
   :class="['text-center mt-1', theme.textColors.secondary, sizeConfig.text.small]"
   :style="getFontStyleForRanking(theme.fontStyles.rankingText)"
  >
   表示テンプレート: {{ theme.displaySettings.scoreFormat }}
  </div>
 </div>

 <!-- データがない場合 -->
 <div v-else-if="!theme" class="p-4 bg-red-100 border border-red-400 rounded">
  <p class="text-red-700">テーマ設定が読み込まれていません</p>
 </div>
</template>

<script setup lang="ts">
import { GameComponentConfig, GameStatistics, UserStatsType } from '@/types';
import { fontMap, useDynamicFonts } from './useDynamicFonts';
import { SizeConfig } from './useComponentConfig';

defineProps<{
 userRankings: UserStatsType[];
 theme: GameComponentConfig | null;
 sizeConfig: SizeConfig;
 gameStatistics: GameStatistics;
 formatPlayerInfo: (player: UserStatsType, scoreFormat: string) => string;
 getRankingRowClass: (index: number) => string[];
 getRankingNumberClass: (index: number, sizeClass: string) => string[];
}>();

// 動的フォント読み込み
const { getFontStyle } = useDynamicFonts();

// フォント名を抽出する関数
const extractFontFamily = (fontClass: string): string | null => {
 return fontMap[fontClass] || null;
};

// ランキング用フォントスタイルを取得
const getFontStyleForRanking = (fontClass: string): Record<string, string> => {
 if (!fontClass) return {};
 const fontFamily = extractFontFamily(fontClass);
 return fontFamily ? getFontStyle(fontFamily) : {};
};
</script>
