<!-- src/DevApp.vue -->
<template>
  <ConfigMaker v-if="!showMain" />
  <MainGenerator v-else />

  <!-- 表示トグルボタン -->
<div class="fixed top-10 right-0 w-24 h-24 z-9999 group pointer-events-none">
  <label
    class="swap swap-rotate absolute top-4 right-4
           opacity-0 group-hover:opacity-100
           pointer-events-auto transition-opacity duration-200"
  >
    <input type="checkbox" v-model="showMain" />
    <Settings class="swap-on w-8 h-8 text-primary" />
    <Cpu class="swap-off w-8 h-8 text-primary" />
  </label>
</div>

</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import MainGenerator from './MainGenerator/App.vue'
  import ConfigMaker from './ConfigMaker/App.vue'
  import { Settings, Cpu } from 'lucide-vue-next'

  const showMain = ref(false)
</script>
