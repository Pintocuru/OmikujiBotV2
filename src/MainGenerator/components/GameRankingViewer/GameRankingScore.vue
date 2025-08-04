<!-- src/MainGenerator/components/GameRankingViewer/GameRankingScore.vue -->
<template>
 <div
  ref="scoreElement"
  class="relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8 min-h-[120px] z-999"
  :class="[theme.fontStyles.scoreText]"
 >
  <!-- Background Icon/SVG -->
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

  <!-- Main Content -->
  <div class="flex flex-col items-center justify-center text-center relative z-10">
   <div :class="['font-bold drop-shadow-lg', theme.textColors.secondary, sizeConfig.text.large]">
    スコア
   </div>

   <div :class="['font-bold drop-shadow-2xl', theme.textColors.primary, sizeConfig.text.xlarge]">
    {{ playerData.points }}
   </div>

   <div
    :class="['mt-2 font-bold drop-shadow-lg', theme.textColors.secondary, sizeConfig.text.large]"
   >
    {{ playerData.name }}
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { GameComponentConfig, UserStatsType, GameRankingScore } from '@/types/';
import { useScoreAnimation } from './useScoreAnimation';
import { SizeConfig } from './useComponentConfig';
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps<{
 playerData: UserStatsType;
 theme: GameComponentConfig;
 sizeConfig: SizeConfig;
 scoreDisplay?: GameRankingScore;
}>();

const { scoreElement, animateScore, resetAnimation } = useScoreAnimation();

const getIconComponent = (iconName: string) => {
 return (LucideIcons as any)[iconName] || null;
};

// props.scoreDisplay と scoreElement の両方を監視し、準備ができたときにアニメーションを開始
watch(
 [() => props.scoreDisplay, scoreElement],
 ([newScoreDisplay, newScoreElement]) => {
  const shouldAnimate = !!newScoreDisplay && !!newScoreElement;
  if (shouldAnimate) {
   animateScore(newScoreDisplay?.scoreAnimation || 'bounce');
  } else {
   resetAnimation();
  }
 },
 { immediate: true, deep: true }
);
</script>
