<!-- src/MainGenerator/layouts/VarietySlot/VarietySlotRanking.vue -->
<template>
  <div class="flex flex-col items-center space-y-4">
    <DraggableWrapper>
      <CookieCounter />
    </DraggableWrapper>

    <DraggableWrapper class="z-100">
      <CommentSpin />
    </DraggableWrapper>

    <DraggableWrapper resizable>
      <div class="scale-150 origin-top">
        <GameRanking />
      </div>
    </DraggableWrapper>
  </div>
</template>

<script setup lang="ts">
  import DraggableWrapper from '../DraggableWrapper.vue'
  import CommentSpin from '@main/ui/CommentSpin/CommentSpin.vue'
  import CookieCounter from '@main/ui/CookieCounter/CookieCounter.vue'
  import GameRanking from '@main/ui/GameRanking/GameRanking.vue'
</script>
