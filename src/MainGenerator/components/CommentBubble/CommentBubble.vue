<!-- templates\OmikujiBot\src\MainGenerator\components\OmikujiBot\OmikujiBot.vue -->
<template>
  <div class="relative">
    <!-- BOTメッセージ表示(0番地) -->
    <ViewBotMessage />

    <!-- 常時表示キャラクター(1番地以降) -->
    <ViewBotCharacter />
  </div>
</template>

<script setup lang="ts">
  import ViewBotMessage from './ViewBotMessage.vue'
  import ViewBotCharacter from './ViewBotCharacter.vue'
</script>
