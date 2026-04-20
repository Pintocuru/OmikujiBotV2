<!-- src/MainGenerator/layouts/OmikujiBot/OmikujiBot.vue -->
<template>
  <!-- フキダシ・トーストは専用uiとしてこのままにする -->
  <DraggableWrapper>
    <CommentBubble />
  </DraggableWrapper>

  <DraggableWrapper>
    <ToastWidgets />
  </DraggableWrapper>

  <!-- ランキング -->
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <DraggableWrapper>
      <GameRanking />
    </DraggableWrapper>
  </div>
</template>

<script setup lang="ts">
  import DraggableWrapper from '../DraggableWrapper.vue'
  import CommentBubble from '@main/ui/CommentBubble/CommentBubble.vue'
  import ToastWidgets from '@main/ui/ToastWidgets/ToastWidgets.vue'
  import GameRanking from '@main/ui/GameRanking/GameRanking.vue'
</script>
