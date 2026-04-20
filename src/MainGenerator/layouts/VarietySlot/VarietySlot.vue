<!-- src/MainGenerator/layouts/GogoBonus/GogoBonus.vue -->
<template>
  <div class="flex flex-col items-center space-y-4">
    <CookieCounter />
    <CommentSpin class="z-100" />
  </div>
</template>

<script setup lang="ts">
  import CommentSpin from '@main/ui/CommentSpin/CommentSpin.vue'
  import CookieCounter from '@main/ui/CookieCounter/CookieCounter.vue'
</script>
