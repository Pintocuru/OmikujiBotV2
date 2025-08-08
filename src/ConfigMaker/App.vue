<!-- src/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-6xl mx-auto pb-24">
  <h1 class="text-2xl font-bold mb-6 text-center text-primary">
   おみくじBot コンフィグエディター
   <span v-if="data.displaySettings.developer.godModeEnabled" class="badge badge-warning">
    GOD-MODE
   </span>
  </h1>

  <!-- 開発者用プリセット管理 -->
  <component :is="devToolsComponent" v-if="devToolsComponent" />

  <!-- 設定読み込み・書き出し -->
  <div class="flex flex-wrap justify-between items-center mb-2 gap-4 min-w-0">
   <ConfigImport />
   <ConfigExport :showTemplateButton="data.displaySettings.developer.showTemplateButton" />
  </div>

  <!-- ナビゲーションタブ -->
  <NavigationTabs />

  <!-- コンテンツ -->
  <ContentArea />

  <!-- Dock/ナビゲーションボタン/トースト -->
  <FloatingElements />
 </div>
</template>

<script setup lang="ts">
import { markRaw, Ref, ref, watch } from 'vue';
import { isDev } from '@/types/';
import { useScrollBehavior } from './components/appItems/useScrollBehavior';
import ConfigImport from '@ConfigComponents/presets/ConfigImport.vue';
import ConfigExport from '@ConfigComponents/presets/ConfigExport.vue';
import NavigationTabs from './components/appItems/NavigationTabs.vue';
import ContentArea from './components/appItems/ContentArea.vue';
import FloatingElements from './components/appItems/FloatingElements.vue';
import { storeToRefs } from 'pinia';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { ThemeType } from '@shared/styles/DaisyUiTheme';

const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 開発者ツール
const devToolsComponent = ref<any | null>(null);
if (isDev) {
 import('@/ConfigMaker/dev/DevConfigs.vue').then((mod) => {
  devToolsComponent.value = markRaw(mod.default);
 });
}

// テーマを <html data-theme=""> に反映（DaisyUI 用）
const themeValue: Ref<ThemeType> = ref('dark');
watch(
 themeValue,
 (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
 },
 { immediate: true }
);
// スクロール動作
useScrollBehavior();
</script>
