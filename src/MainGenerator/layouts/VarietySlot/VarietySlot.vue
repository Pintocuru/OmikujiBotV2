<!-- src/MainGenerator/layouts/VarietySlot/VarietySlot.vue -->
<template>
  <div class="flex flex-col items-center space-y-4">
    <CommentSpin />
    <div class="w-full">
      <GameRanking />
    </div>
  </div>
</template>

<script setup lang="ts">
  import CommentSpin from '@main/ui/CommentSpin/CommentSpin.vue'
  import GameRanking from '@main/ui/GameRanking/GameRanking.vue'
</script>
