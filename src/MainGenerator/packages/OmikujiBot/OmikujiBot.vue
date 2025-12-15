<!-- templates\OmikujiBot\src\MainGenerator\packages\OmikujiBot\OmikujiBot.vue -->
<!-- ! 廃止 -->
<template>
  <!-- コメントフキダシ表示 -->
  <CommentBubble />

  <!-- 右下UI要素コンテナ -->
  <ToastWidgets />
</template>

<script setup lang="ts">
  import CommentBubble from '@MainComponents/CommentBubble/CommentBubble.vue'
  import ToastWidgets from '@/MainGenerator/components/ToastWidgets/ToastWidgets.vue'
</script>
