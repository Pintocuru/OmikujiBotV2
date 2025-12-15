<!-- templates\OmikujiBot\src\MainGenerator\components\OmikujiBot\OmikujiBot.vue -->
<template>
  <!-- BOTメッセージ表示(0番地) -->
  <ViewBotMessage />

  <!-- 常時表示キャラクター(1番地以降) -->
  <ViewBotCharacter />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import ViewBotMessage from './ViewBotMessage.vue'
  import ViewBotCharacter from './ViewBotCharacter.vue'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  // Piniaストアの使用
  const appStore = useAppStore()
</script>
