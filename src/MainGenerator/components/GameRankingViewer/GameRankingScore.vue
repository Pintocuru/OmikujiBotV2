<!-- GameRankingScore.vue -->
<template>
 <div
  ref="scoreElement"
  class="relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8 min-h-[120px] z-999"
 >
  <!-- Background Icon/SVG - 中央に絶対配置 -->
  <component
   v-if="theme.background.scoreDisplay?.icon"
   :is="getIconComponent(theme.background.scoreDisplay.icon.name)"
   :size="sizeConfig.score.iconSize"
   :class="[
    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full',
    theme.background.scoreDisplay.icon.color,
    sizeConfig.score.border,
    theme.background.scoreDisplay.icon.className
   ]"
  />

  <img
   v-else-if="theme.background.scoreDisplay?.svg"
   :src="theme.background.scoreDisplay.svg.src"
   :class="[
    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    theme.background.scoreDisplay.svg.className
   ]"
   :style="{
    width: `${sizeConfig.score.iconSize}px`,
    height: `${sizeConfig.score.iconSize}px`
   }"
   alt="Background"
  />

  <!-- Main Content - 前面に表示 -->
  <div class="flex flex-col items-center justify-center text-center relative z-10">
   <div
    :class="[
     'font-bold drop-shadow-lg',
     theme.fontClass.scoreDisplay,
     theme.text.secondary,
     sizeConfig.text.large
    ]"
   >
    スコア
   </div>

   <div
    :class="[
     'font-bold drop-shadow-2xl',
     theme.fontClass.scoreDisplay,
     theme.text.primary,
     sizeConfig.text.xlarge
    ]"
   >
    {{ playerData.points }}
   </div>

   <div
    :class="[
     'mt-2 font-bold drop-shadow-lg',
     theme.fontClass.scoreDisplay,
     theme.text.secondary,
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
import type { GameRankingTheme } from '@/MainGenerator/components/GameRankingViewer/GameRankingTypes';
import * as LucideIcons from 'lucide-vue-next';
import { UserStatsType } from '@shared/types/';
import { SizeConfig } from '@/MainGenerator/components/GameRankingViewer/useComponentConfig';

interface Props {
 playerData: UserStatsType;
 theme: GameRankingTheme;
 sizeConfig: SizeConfig;
}

const props = defineProps<Props>();

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
