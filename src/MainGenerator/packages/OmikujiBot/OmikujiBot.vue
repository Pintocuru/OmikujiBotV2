<!-- templates\OmikujiBot\src\MainGenerator\packages\OmikujiBot\OmikujiBot.vue -->
<template>
  <div>
    <!-- コメントフキダシ表示 -->
    <CommentBubble />

    <!-- 右下UI要素コンテナ -->
    <ToastWidgets />
  </div>
</template>

<script setup lang="ts">
  import CommentBubble from '@MainComponents/CommentBubble/CommentBubble.vue'
  import ToastWidgets from '@/MainGenerator/components/ToastWidgets/ToastWidgets.vue'
</script>
