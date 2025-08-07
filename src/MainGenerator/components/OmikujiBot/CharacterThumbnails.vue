<!-- src/MainGenerator/components/CharacterControlPanel.vue -->
<template>
 <div class="fixed bottom-4 right-4 z-50">
  <div class="flex items-end gap-3" style="flex-direction: row-reverse">
   <div
    v-for="(character, index) in characters"
    :key="index"
    class="relative cursor-pointer"
    :style="{ zIndex: characters.length - index }"
    @click="handleCharacterClick(character, false)"
    @contextmenu.prevent="handleCharacterClick(character, true)"
   >
    <div
     class="relative rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:scale-120"
     :class="[index === 0 ? sizeConfig.primaryAvatar : sizeConfig.secondaryAvatar]"
    >
     <img
      :src="getImagePath(character.image[currentExpressions[index]])"
      :alt="`${character.name}のアイコン`"
      class="w-full h-full object-cover transition-all duration-500"
      :style="{
       backgroundColor: character.color.backgroundColor || '#ccc'
      }"
     />
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { DisplaySize } from '@shared/types';
import {
 characterEmotions,
 CharacterEmotionType,
 CharacterType,
 PostActionSchema,
 getImagePath
} from '@/types/';
import { useAppStore, useDisplayStore } from '@/MainGenerator/stores/';

// Piniaストアの使用
const appStore = useAppStore();
const displayStore = useDisplayStore();

// リアクティブ変数
const characters = computed(() => appStore.characterCollector.getUsedCharacterPresets());
const displaySize = computed(() => displayStore.displaySize);
const currentExpressions = ref<CharacterEmotionType[]>([]);
const expressionTimer = ref<ReturnType<typeof setTimeout> | null>(null);

// サイズ設定の定数
const SIZE_CONFIG = {
 xs: {
  primaryAvatar: 'w-8 h-8',
  secondaryAvatar: 'w-8 h-8'
 },
 sm: {
  primaryAvatar: 'w-10 h-10',
  secondaryAvatar: 'w-10 h-10'
 },
 md: {
  primaryAvatar: 'w-12 h-12',
  secondaryAvatar: 'w-12 h-12'
 },
 lg: {
  primaryAvatar: 'w-16 h-16',
  secondaryAvatar: 'w-16 h-16'
 },
 xl: {
  primaryAvatar: 'w-20 h-20',
  secondaryAvatar: 'w-20 h-20'
 }
} as const;

const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value]);

// 初期化
onMounted(() => {
 // 各キャラクターの初期表情を設定
 currentExpressions.value = characters.value.map(() => 'default');
 startExpressionCycle();
});

// クリーンアップ
onUnmounted(() => {
 if (expressionTimer.value) clearTimeout(expressionTimer.value);
});

// 表情サイクルの開始（5秒に1回抽選を行い、5%で特別な表情）
const startExpressionCycle = () => {
 const updateExpressions = () => {
  characters.value.forEach((character, index) => {
   const changeChance = Math.random() < 0.05;
   const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)];
   currentExpressions.value[index] = changeChance ? randomEmotion : 'default';
  });
  expressionTimer.value = setTimeout(updateExpressions, 5000);
 };

 // 初回実行
 updateExpressions();
};

// キャラクタークリック時の処理
const handleCharacterClick = (character: CharacterType, isToast: boolean) => {
 try {
  const changeChance = Math.random() < 0.5;
  const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)];
  const postAction = PostActionSchema.parse({
   characterKey: character.id,
   iconKey: changeChance ? randomEmotion : 'default',
   messageContent: !isToast
    ? `${character.name}のテストメッセージです！`
    : `${character.name}のトーストメッセージです！`
  });

  // テストメッセージを生成し、ストアに追加
  const testMessage = appStore.characterCollector.generateTestMessage(postAction, isToast);
  appStore.addBotMessage(testMessage);
 } catch (error) {
  console.error('テストメッセージの生成に失敗しました:', error);
 }
};
</script>
