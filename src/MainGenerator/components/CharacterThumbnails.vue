<!-- src/MainGenerator/components/CharacterControlPanel.vue -->
<template>
 <div class="fixed bottom-4 right-4 z-50">
  <!-- キャラクター画像群 -->
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
     <!-- キャラクター画像 -->
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
 BotMessage,
 characterEmotions,
 CharacterEmotionType,
 CharacterType,
 PostActionSchema,
 PostActionType,
 getImagePath
} from '@type/';

// Props
const props = defineProps<{
 characters: CharacterType[];
 displaySize: DisplaySize;
 generateTestMessage: (postAction: PostActionType, isToast: boolean) => BotMessage;
}>();

// Emits
const emit = defineEmits<{
 testMessage: [message: BotMessage];
}>();

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

// リアクティブ変数
const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize]);
const characters = computed(() => props.characters);
const currentExpressions = ref<CharacterEmotionType[]>([]);
const expressionTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const menuTimer = ref<number | null>(null);

// 初期化
onMounted(() => {
 // 各キャラクターの初期表情を設定
 currentExpressions.value = characters.value.map(() => 'default');
 startExpressionCycle();
});

// クリーンアップ
onUnmounted(() => {
 if (expressionTimer.value) clearTimeout(expressionTimer.value);
 if (menuTimer.value) clearTimeout(menuTimer.value);
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
  // PostActionSchemaを使用してテストメッセージ用のデータを作成
  const changeChance = Math.random() < 0.5;
  const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)];

  const postAction = PostActionSchema.parse({
   characterKey: character.id,
   iconKey: changeChance ? randomEmotion : 'default',
   messageContent: !isToast
    ? `${character.name}のテストメッセージです！`
    : `${character.name}のトーストメッセージです！`
  });

  // テストメッセージを生成
  const testMessage = props.generateTestMessage(postAction, isToast);

  // 親コンポーネントに通知
  emit('testMessage', testMessage);
 } catch (error) {
  console.error('テストメッセージの生成に失敗しました:', error);
 }
};
</script>
