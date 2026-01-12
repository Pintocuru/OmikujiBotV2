<!-- src/DevApp.vue -->
<template>
  <ConfigMaker v-if="!showMain" />
  <MainGenerator v-else />

  <!-- 表示トグルボタン -->
  <label class="swap swap-rotate fixed top-12 right-6 z-9999">
    <input type="checkbox" v-model="showMain" />

    <!-- ON: MainGenerator 表示中 (Settingsアイコン) -->
    <Settings class="swap-on w-8 h-8 text-primary" />

    <!-- OFF: ConfigMaker 表示中 (Cpuアイコン) -->
    <Cpu class="swap-off w-8 h-8 text-primary" />
  </label>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import MainGenerator from './MainGenerator/App.vue'
  import ConfigMaker from './ConfigMaker/App.vue'
  import { Settings, Cpu } from 'lucide-vue-next'

  const showMain = ref(false)
</script>
