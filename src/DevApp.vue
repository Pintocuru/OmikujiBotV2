<!-- src/DevApp.vue -->
<template>
 <MainGenerator v-if="showMain" />
 <component v-if="!showMain" :is="ConfigMakerRaw" />

 <!-- ボタン群（右上固定） -->
 <div class="fixed top-6 right-6 z-999 flex gap-2 items-center">
  <!-- テーマ切り替えボタン -->
  <div class="relative">
   <button
    @click="toggleThemeMenu"
    class="btn btn-circle btn-primary p-2 shadow-lg transition-opacity duration-300 opacity-50 hover:opacity-100"
   >
    <Palette class="w-6 h-6" />
   </button>

   <!-- テーマ選択メニュー -->
   <div
    v-if="themeMenuOpen"
    class="absolute top-full right-0 mt-2 bg-base-300 text-base-content rounded-box z-10 w-80 p-2 shadow-lg grid grid-cols-3 gap-2"
   >
    <button
     v-for="themeOption in themes"
     :key="themeOption"
     class="btn btn-ghost hover:bg-primary/20"
     @click="selectTheme(themeOption)"
    >
     {{ themeOption }}
    </button>
   </div>
  </div>

  <!-- 表示トグルボタン -->
  <button
   @click="toggleView"
   class="btn btn-circle btn-primary p-1 shadow-lg transition-opacity duration-300 opacity-50 hover:opacity-100"
  >
   <component :is="showMain ? SettingsIcon : Cpu" class="w-6 h-6" />
  </button>
 </div>
</template>

<script setup lang="ts">
import { ref, markRaw, Ref, watch } from 'vue';
import MainGenerator from './MainGenerator/App.vue';
import ConfigMaker from './ConfigMaker/App.vue';
import { themes, ThemeType } from '@omiken/shared/styles/DaisyUiTheme';
import { Settings as SettingsIcon, Cpu, Palette } from 'lucide-vue-next';

const showMain = ref(true);
const toggleView = () => {
 showMain.value = !showMain.value;
};

// テーマ切り替え用
const themeValue: Ref<ThemeType> = ref('dark');
const themeMenuOpen = ref(false);
const toggleThemeMenu = () => {
 themeMenuOpen.value = !themeMenuOpen.value;
};
const selectTheme = (theme: ThemeType) => {
 themeValue.value = theme;
 themeMenuOpen.value = false;
};

// テーマを反映（DaisyUI 用）
watch(
 themeValue,
 (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
 },
 { immediate: true }
);

// 状態を保持したまま表示切り替え
const ConfigMakerRaw = markRaw(ConfigMaker);
</script>
