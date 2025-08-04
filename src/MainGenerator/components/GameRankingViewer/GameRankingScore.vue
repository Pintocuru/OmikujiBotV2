<!-- src/MainGenerator/components/GameRankingViewer/GameRankingScore.vue -->
<template>
 <div
  ref="scoreElement"
  class="relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8 min-h-[120px] z-999"
 >
  <!-- Background Icon/SVG - 中央に絶対配置 -->
  <component
   v-if="scoreDisplay?.scoreIcon?.iconName"
   :is="getIconComponent(scoreDisplay.scoreIcon.iconName)"
   :size="sizeConfig.score.iconSize"
   :class="[
    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full',
    scoreDisplay.scoreIcon.iconColor,
    sizeConfig.score.border,
    scoreDisplay.scoreIcon.customClass
   ]"
  />

  <!-- Main Content - 前面に表示 -->
  <div class="flex flex-col items-center justify-center text-center relative z-10">
   <div
    :class="['font-bold drop-shadow-lg', theme.textColors.secondary, sizeConfig.text.large]"
    :style="getFontStyle(theme.fontStyles.scoreText)"
   >
    スコア
   </div>

   <div
    :class="['font-bold drop-shadow-2xl', theme.textColors.primary, sizeConfig.text.xlarge]"
    :style="getFontStyle(theme.fontStyles.scoreText)"
   >
    {{ playerData.points }}
   </div>

   <div
    :class="['mt-2 font-bold drop-shadow-lg', theme.textColors.secondary, sizeConfig.text.large]"
    :style="getFontStyle(theme.fontStyles.scoreText)"
   >
    {{ playerData.name }}
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GameComponentConfig, UserStatsType, GameRankingScore } from '@/types/';
import { useScoreAnimation } from './useScoreAnimation';
import { fontMap, useDynamicFonts } from './useDynamicFonts';
import { SizeConfig } from './useComponentConfig';
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps<{
 playerData: UserStatsType;
 theme: GameComponentConfig;
 sizeConfig: SizeConfig;
 scoreDisplay?: GameRankingScore;
}>();

// 動的フォント読み込み
const { getFontStyle } = useDynamicFonts();

// スコアアニメーション
// TODO:アニメーションは必ず動作しない。なにがあった？
const { scoreElement } = useScoreAnimation();

// Lucide アイコンコンポーネントを取得
const getIconComponent = (iconName: string) => {
 return (LucideIcons as any)[iconName] || null;
};

// フォント名を抽出する関数
const extractFontFamily = (fontClass: string): string | null => {
 return fontMap[fontClass] || null;
};

// フォントスタイルを取得する関数
const getFontStyleForClass = (fontClass: string): Record<string, string> => {
 if (!fontClass) return {};

 const fontFamily = extractFontFamily(fontClass);
 if (fontFamily) {
  return getFontStyle(fontFamily);
 }

 return {};
};

// スコア表示設定のcomputed
const scoreDisplayConfig = computed(() => {
 return props.scoreDisplay || props.theme.scoreDisplay;
});
</script>
