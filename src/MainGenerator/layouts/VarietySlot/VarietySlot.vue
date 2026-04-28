<!-- src/MainGenerator/layouts/VarietySlot/VarietySlot.vue -->
<template>
  <div class="flex flex-col items-center space-y-4">
    <DraggableWrapper>
      <CookieCounter />
    </DraggableWrapper>

    <DraggableWrapper class="z-100">
      <CommentSpin />
    </DraggableWrapper>
  </div>
</template>

<script setup lang="ts">
  import DraggableWrapper from '../DraggableWrapper.vue'
  import CommentSpin from '@main/ui/CommentSpin/CommentSpin.vue'
  import CookieCounter from '@main/ui/CookieCounter/CookieCounter.vue'
</script>
