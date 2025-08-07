<!-- src/MainGenerator/App.vue -->
<template>
 <div v-if="appStore.isInitialized">
  <!-- BOTメッセージ表示 -->
  <ViewBotMessage
   v-if="displayStore.currentScriptKey === null"
   :botMessages="appStore.botMessages"
   :displaySize="displayStore.displaySize"
   :animationType="'slideUp'"
  />

  <!-- Scriptsゲーム表示 -->
  <GameRankingViewer
   v-else-if="displayStore.currentScriptKey !== null"
   :key="displayStore.currentScriptGameProps.componentKey"
   v-bind="displayStore.currentScriptGameProps"
  />

  <!-- コントロールパネル（中央ホバーで表示:GODモードでのみ表示） -->
  <DisplayControlPanel
   v-if="appStore.omikujiData.displaySettings.developer.godModeEnabled"
   :availableScriptKeys="displayStore.availableScriptKeys"
   :currentScriptKey="displayStore.currentScriptKey"
   :displaySize="displayStore.displaySize"
   :switchToMode="displayStore.switchToMode"
   :setDisplaySize="displayStore.setDisplaySize"
  />

  <!-- トースト表示 -->
  <ViewBotToast
   v-if="appStore.omikujiData.displaySettings.base.toastEnabled"
   :botMessages="appStore.botMessages"
   :displaySize="displayStore.displaySize"
  />

  <!-- キャラクターサムネイル -->
  <CharacterThumbnails
   v-if="appStore.omikujiData.displaySettings.base.modeSwitchEnabled"
   :characters="appStore.characterCollector.getUsedCharacterPresets()"
   :displaySize="displayStore.displaySize"
   :generateTestMessage="
    appStore.characterCollector.generateTestMessage.bind(appStore.characterCollector)
   "
   @testMessage="handleTestMessage"
  />
 </div>
 <!-- わんコメが起動されていない場合のエラー表示 -->
 <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { BotMessage } from '@/types/';
import ViewBotMessage from '@MainComponents/OmikujiBot/ViewBotMessage.vue';
import ViewBotToast from '@/MainGenerator/components/OmikujiBot/ViewBotToast.vue';
import CharacterThumbnails from '@MainComponents/OmikujiBot/CharacterThumbnails.vue';
import DisplayControlPanel from '@MainComponents/OmikujiBot/DisplayControlPanel.vue';
import ErrorInitComponent from '@shared/components/error/ErrorInitComponent.vue';
import GameRankingViewer from '@MainComponents/GameRankingViewer/GameRankingViewer.vue';
import { useAppStore, useDisplayStore } from '@/MainGenerator/stores/';

// Piniaストアの使用
const appStore = useAppStore();
const displayStore = useDisplayStore();

// イベントハンドラー
const handleTestMessage = (message: BotMessage) => {
 appStore.botMessages = [...appStore.botMessages, message];
};

// 初期化処理
onMounted(async () => {
 // アプリケーションの初期化
 await appStore.initializeApp();

 // 表示モードの初期化
 displayStore.initializeDisplayMode();
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
