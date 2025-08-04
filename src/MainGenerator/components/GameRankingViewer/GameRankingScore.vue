<!-- GameRankingScore.vue -->
<template>
 <div
  ref="scoreElement"
  class="relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8 min-h-[120px] z-999"
 >
  <!-- Background Icon/SVG - 中央に絶対配置 -->
  <component
   v-if="theme.backgrounds.scoreIcon?.iconName"
   :is="getIconComponent(theme.backgrounds.scoreIcon.iconName)"
   :size="sizeConfig.score.iconSize"
   :class="[
    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full',
    theme.backgrounds.scoreIcon.iconColor,
    sizeConfig.score.border,
    theme.backgrounds.scoreIcon.customClass
   ]"
  />

  <!-- Main Content - 前面に表示 -->
  <div class="flex flex-col items-center justify-center text-center relative z-10">
   <div
    :class="[
     'font-bold drop-shadow-lg',
     theme.fontStyles.scoreText,
     theme.textColors.secondary,
     sizeConfig.text.large
    ]"
   >
    スコア
   </div>

   <div
    :class="[
     'font-bold drop-shadow-2xl',
     theme.fontStyles.scoreText,
     theme.textColors.primary,
     sizeConfig.text.xlarge
    ]"
   >
    {{ playerData.points }}
   </div>

   <div
    :class="[
     'mt-2 font-bold drop-shadow-lg',
     theme.fontStyles.scoreText,
     theme.textColors.secondary,
     sizeConfig.text.large
    ]"
   >
    {{ playerData.name }}
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useScoreAnimation } from '@/MainGenerator/components/GameRankingViewer/useScoreAnimation';
import type { GameRankingTheme } from '@/types/GameComponent/GameRankingTypes';
import * as LucideIcons from 'lucide-vue-next';
import { SizeConfig } from '@/MainGenerator/components/GameRankingViewer/useComponentConfig';
import { UserStatsType } from '@/types/';

const props = defineProps<{
 playerData: UserStatsType;
 theme: GameRankingTheme;
 sizeConfig: SizeConfig;
}>();

// スコアアニメーション
const { scoreElement, initScoreAnimation } = useScoreAnimation();

// Lucide アイコンコンポーネントを取得
const getIconComponent = (iconName: string) => {
 return (LucideIcons as any)[iconName] || null;
};

// 初回マウント時のアニメーション
onMounted(() => {
 initScoreAnimation(props.theme.scoreAnimation);
});
</script>
