<!-- src/MainGenerator/layouts/GogoBonus/GogoBonus.vue -->
<template>
  <div class="flex flex-col items-center space-y-4">
    <DraggableWrapper>
      <CommentSpin />
    </DraggableWrapper>

    <div class="w-full">
      <DraggableWrapper>
        <CookieCounter />
      </DraggableWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DraggableWrapper from '../DraggableWrapper.vue'
  import CommentSpin from '@main/ui/CommentSpin/CommentSpin.vue'
  import CookieCounter from '@main/ui/CookieCounter/CookieCounter.vue'
</script>
