<!-- src/DevApp.vue -->
<template>
  <ConfigMaker v-if="!showMain" />
  <MainGenerator v-else data-theme="transparent" />

  <!-- 表示トグルボタン -->
  <label class="swap swap-rotate fixed top-6 right-6 z-9999">
    <input type="checkbox" v-model="showMain" />

    <!-- ON: MainGenerator 表示中 (Settingsアイコン) -->
    <SettingsIcon class="swap-on w-8 h-8 text-primary" />

    <!-- OFF: ConfigMaker 表示中 (Cpuアイコン) -->
    <Cpu class="swap-off w-8 h-8 text-primary" />
  </label>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import MainGenerator from './MainGenerator/App.vue'
  import ConfigMaker from './ConfigMaker/App.vue'
  import { Settings as SettingsIcon, Cpu } from 'lucide-vue-next'

  const showMain = ref(false)
</script>
