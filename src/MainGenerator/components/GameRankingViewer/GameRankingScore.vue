<!-- src\MainGenerator\components\GameRankingViewer\GameRankingScore.vue -->
<template>
  <div v-if="theme">
    <div
      v-motion="animationConfig"
      class="relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8 min-h-[120px] z-999"
      :class="[theme.fontStyles.scoreText]"
    >
      <!-- lucide Icon -->
      <component
        v-if="scoreDisplay?.scoreIcon?.iconName"
        :is="getIconComponent(scoreDisplay.scoreIcon.iconName)"
        :size="sizeConfig.score.iconSize"
        :class="[
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full',
          scoreDisplay.scoreIcon.iconColor,
          sizeConfig.score.border,
          scoreDisplay.scoreIcon.customClass,
        ]"
      />

      <!-- Main Content -->
      <div class="flex flex-col items-center justify-center text-center relative z-10">
        <div :class="['font-bold drop-shadow-lg', theme.textColors.secondary, sizeConfig.text.large]">スコア</div>

        <div :class="['font-bold drop-shadow-2xl', theme.textColors.primary, sizeConfig.text.xlarge]">
          {{ playerData.points }}
        </div>

        <div :class="['mt-2 font-bold drop-shadow-lg', theme.textColors.secondary, sizeConfig.text.large]">
          {{ playerData.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ANIMATION_CONFIGS } from './composables/useScoreAnimation'
  import { COMPONENT_SIZE_CONFIG } from './composables/useComponentConfig'
  import { useDisplayStore } from '@/MainGenerator/stores/useDisplayStore'
  import { storeToRefs } from 'pinia'
  import * as LucideIcons from 'lucide-vue-next'

  const displayStore = useDisplayStore()
  const { displaySize, currentUserRankings, currentComponentConfig } = storeToRefs(displayStore)

  const sizeConfig = computed(() => COMPONENT_SIZE_CONFIG[displaySize.value])
  const playerData = computed(() => currentUserRankings.value[0])
  const theme = computed(() => currentComponentConfig.value)
  const scoreDisplay = computed(() => currentComponentConfig.value?.scoreDisplay)

  const animationConfig = computed(() => ANIMATION_CONFIGS['bounce'])

  const getIconComponent = (iconName: string) => {
    return (LucideIcons as any)[iconName] || null
  }
</script>
