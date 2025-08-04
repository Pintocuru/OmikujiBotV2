<!-- src/MainGenerator/components/GameRankingViewer/GameRankingScore.vue -->
<template>
 <div
  ref="scoreElement"
  class="relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8 min-h-[120px] z-999"
  :class="[theme.fontStyles.scoreText]"
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
import { computed, onMounted, watch } from 'vue'; // watch をインポート
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

// scoreDisplay は親コンポーネントから渡されるため、直接 watch します
// scoreDisplay?.isVisible はリアクティブではない可能性があるため、computed で監視対象を定義します
const isScoreDisplayVisible = computed(() => props.scoreDisplay);

watch(
 isScoreDisplayVisible,
 (isVisible) => {
  if (isVisible) {
   // 表示されたらループアニメーションを開始
   // ここで 'pulse' や 'heartBeat' など、ループを設定したアニメーションタイプを指定します
   animateScore('pulse'); // 例: pulse アニメーションを使用
  } else {
   // 非表示になったらアニメーションをリセット（停止）
   resetAnimation();
  }
 },
 { immediate: true }
); // コンポーネントの初期ロード時にもチェック

// Lucide アイコンコンポーネントを取得
const getIconComponent = (iconName: string) => {
 return (LucideIcons as any)[iconName] || null;
};
onMounted(() => {
 console.log('scoreElement on mounted:', scoreElement.value);
});
// スコア表示設定のcomputed
const scoreDisplayConfig = computed(() => {
 return props.scoreDisplay || props.theme.scoreDisplay;
});
</script>
