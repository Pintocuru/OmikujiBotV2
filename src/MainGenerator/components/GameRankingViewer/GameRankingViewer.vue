<!-- src/MainGenerator/components/GameRankingViewer/GameRankingViewer.vue -->
<template>
 <div v-if="theme">
  <!-- Score Display with Animation -->
  <GameRankingScore
   v-if="scoreDisplay.isVisible.value && userRankings.length > 0"
   :player-data="userRankings[0]"
   :theme="theme"
   :size-config="sizeConfig"
   :score-display="theme.scoreDisplay"
  />

  <!-- Ranking list -->
  <GameRankingList
   :user-rankings="userRankings"
   :theme="theme"
   :size-config="sizeConfig"
   :game-statistics="gameStatistics"
   :format-player-info="formatPlayerInfo"
   :get-ranking-row-class="getRankingRowClass"
   :get-ranking-number-class="getRankingNumberClass"
  />

  <!-- デバッグ用 -->
  <TailwindDebugComponent v-show="false" />
 </div>

 <!-- componentConfigがnullの場合はエラー表示 -->
 <div v-else class="p-4 bg-red-100 border border-red-400 rounded">
  <p class="text-red-700">設定が読み込まれていません</p>
  <p class="text-red-600 text-sm mt-1">
   componentConfig: {{ props.componentConfig ? 'loaded' : 'null' }}
  </p>
 </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { ScriptComponentPropsType } from '@/types/';
import { COMPONENT_SIZE_CONFIG } from '@/MainGenerator/components/GameRankingViewer/useComponentConfig';
import { useDelayedDisplay } from '@/MainGenerator/components/GameRankingViewer/useDelayedDisplay';
import { useGameRanking } from './useGameRanking';
import { fontMap, useDynamicFonts } from './useDynamicFonts';
import GameRankingScore from './GameRankingScore.vue';
import GameRankingList from './GameRankingList.vue';
import TailwindDebugComponent from './TailwindDebugComponent.vue';

const props = defineProps<ScriptComponentPropsType>();
/**
 type ScriptComponentPropsType = {
 componentConfig: GameComponentConfig | null;
 settings: DefaultTypes;
 userRankings: UserStatsType[];
 displaySize: DisplaySize;
};
 */

// 動的フォント読み込み
const { getFontStyle, loadFont } = useDynamicFonts();

// Score display control
const scoreDisplay = useDelayedDisplay(() => props.userRankings || [], {
 delayMs: 4500,
 displayMs: 9995000
});

// Size configuration
const sizeConfig = computed(() => COMPONENT_SIZE_CONFIG[props.displaySize]);

// Null安全なtheme
const theme = computed(() => {
 if (!props.componentConfig) return null;

 // フォントスタイルを動的に取得してテーマに追加
 const updatedTheme = { ...props.componentConfig };

 // フォント名を抽出してスタイルオブジェクトに変換
 if (updatedTheme.fontStyles.scoreText) {
  const fontFamily = extractFontFamily(updatedTheme.fontStyles.scoreText);
  if (fontFamily) {
   updatedTheme.fontStyles.scoreTextStyle = getFontStyle(fontFamily);
  }
 }

 if (updatedTheme.fontStyles.rankingText) {
  const fontFamily = extractFontFamily(updatedTheme.fontStyles.rankingText);
  if (fontFamily) {
   updatedTheme.fontStyles.rankingTextStyle = getFontStyle(fontFamily);
  }
 }

 return updatedTheme;
});

// フォント名を抽出する関数
const extractFontFamily = (fontClass: string): string | null => {
 return fontMap[fontClass] || null;
};

// ゲームランキングコンポーザブル
const {
 gameStatistics,
 userRankings,
 formatPlayerInfo,
 getRankingRowClass,
 getRankingNumberClass
} = useGameRanking(props.userRankings || [], props.componentConfig);

// フォントの動的読み込み監視
watch(
 () => theme.value,
 (newTheme) => {
  if (newTheme) {
   // 必要なフォントを動的に読み込み
   const scoreFont = extractFontFamily(newTheme.fontStyles.scoreText);
   const rankingFont = extractFontFamily(newTheme.fontStyles.rankingText);

   if (scoreFont) loadFont(scoreFont);
   if (rankingFont) loadFont(rankingFont);
  }
 },
 { immediate: true }
);
</script>
