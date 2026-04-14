<!-- src/MainGenerator/layouts/OmikujiBot/OmikujiBot.vue -->
<template>
  <CommentBubble />
  <ToastWidgets />
  <GameRanking />
</template>

<script setup lang="ts">
  import CommentBubble from '@main/ui/CommentBubble/CommentBubble.vue'
  import ToastWidgets from '@main/ui/ToastWidgets/ToastWidgets.vue'
  import GameRanking from '@main/ui/GameRanking/GameRanking.vue'
</script>
