<!-- src/DevApp.vue -->
<template>
 <MainGenerator v-if="showMain" />

 <!-- ConfigMaker は状態保持したまま切り替えたいので component + markRaw -->
 <component v-if="!showMain" :is="ConfigMakerRaw" />

 <button
  @click="toggleView"
  class="fixed top-6 right-6 z-999 btn btn-xl btn-circle btn-primary p-1 shadow-lg transition-opacity duration-300 opacity-50 hover:opacity-100"
 >
  <component :is="showMain ? SettingsIcon : GeneratorIcon" class="w-12 h-12" />
 </button>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue';
import MainGenerator from './MainGenerator/App.vue';
import ConfigMaker from './ConfigMaker/App.vue';
import { Settings as SettingsIcon, Cpu as GeneratorIcon } from 'lucide-vue-next';

const showMain = ref(true);
const toggleView = () => {
 showMain.value = !showMain.value;
};

// ConfigMaker は、状態を保持するために markRaw を使う
const ConfigMakerRaw = markRaw(ConfigMaker);
</script>
