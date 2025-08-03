<!-- src/MainGenerator/App.vue -->
<template>
 <div v-if="isInitialized">
  <!-- BOTメッセージ表示 -->
  <ViewBotMessage
   v-if="currentScriptKey === null"
   :botMessages="botMessages"
   :displaySize="displaySize"
   :animationType="'slideUp'"
  />

  <!-- Scriptsゲーム表示 -->
  <GameRankingViewer
   v-else-if="currentScriptKey !== null"
   v-bind="currentScriptGameProps"
   ref="scriptGameRef"
  />

  <!-- コントロールパネル（中央ホバーで表示） -->
  <DisplayControlPanel
   :availableScriptKeys="availableScriptKeys"
   :currentScriptKey="currentScriptKey"
   :displaySize="displaySize"
   :switchToMode="switchToMode"
   :setDisplaySize="setDisplaySize"
  />

  <!-- トースト表示 -->
  <ViewBotToast
   v-if="omikujiData.displaySettings.toastEnabled"
   :botMessages="botMessages"
   :displaySize="displaySize"
  />

  <!-- キャラクターサムネイル -->
  <CharacterThumbnails
   v-if="omikujiData.displaySettings.modeSwitchEnabled"
   :characters="characterCollector.getUsedCharacterPresets()"
   :displaySize="displaySize"
   :generateTestMessage="characterCollector.generateTestMessage.bind(characterCollector)"
   @testMessage="(message: BotMessage) => (botMessages = [...botMessages, message])"
  />
 </div>
 <!-- わんコメが起動されていない場合のエラー表示 -->
 <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { OmikujiDataSchema, BotMessage } from '@/types/';
import ViewBotMessage from '@/MainGenerator/components/ViewBotMessage.vue';
import ViewBotToast from '@/MainGenerator/components/ViewBotToast.vue';
import CharacterThumbnails from '@/MainGenerator/components/CharacterThumbnails.vue';
import DisplayControlPanel from '@/MainGenerator/components/OmikujiBot/DisplayControlPanel.vue';
import { useDisplayMode } from '@/MainGenerator/composables/useDisplayMode';
import { useMessageHandler } from '@/MainGenerator/composables/useMessageHandler';
import { GetUserComments } from '@shared/sdk/subscribe/GetUserComments';
import ErrorInitComponent from '@shared/components/error/ErrorInitComponent.vue';
import GameRankingViewer from '@/MainGenerator/components/GameRankingViewer/GameRankingViewer.vue';
import { ConfigUserSchema } from '@shared/types';

// omikujiData config の読み込み
const omikujiData = OmikujiDataSchema.parse(window.omikujiData);
const config = ConfigUserSchema.parse(window.userConfig);

// ref
const isInitialized = ref(true); // 初期化完了フラグ
const scriptGameRef = ref(); // コンポーネント用ref

// コンポーザブルの使用
const { botMessages, scriptManager, characterCollector, updateBotMessages, startTimers } =
 useMessageHandler(omikujiData);

const {
 availableScriptKeys,
 currentScriptKey,
 currentScriptGameProps,
 displaySize,
 switchToMode,
 setDisplaySize,
 forceUpdate
} = useDisplayMode(omikujiData, scriptManager);

// GetUserVisitsコンポーザブルから取得
const { fetchComments } = GetUserComments(config);

// 初期化処理
onMounted(async () => {
 try {
  const isInit = await fetchComments((comments) => {
   updateBotMessages(comments);
   forceUpdate(); // Scripts更新トリガー
  });

  isInitialized.value = isInit;
  // タイマー開始
  if (isInit) startTimers();
 } catch (error) {
  console.error('初期化エラー:', error);
  isInitialized.value = false;
 }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700;900&display=swap');
html,
body {
 height: 100%;
 width: 100%;
 margin: 0;
 padding: 0;
 overflow: hidden;
 font-family: 'Zen Maru Gothic', sans-serif;
}
</style>
