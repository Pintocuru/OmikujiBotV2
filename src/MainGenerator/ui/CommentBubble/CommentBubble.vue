<!-- src\MainGenerator\ui\CommentBubble\CommentBubble.vue -->
<template>
  <div class="relative">
    <!-- BOTメッセージ表示(0番地) -->
    <CommentBubbleZero />

    <!-- 常時表示キャラクター(1番地以降) -->
    <CommentBubblePersistent />
  </div>
</template>

<script setup lang="ts">
  import CommentBubbleZero from './CommentBubbleZero.vue'
  import CommentBubblePersistent from './CommentBubblePersistent.vue'
</script>
