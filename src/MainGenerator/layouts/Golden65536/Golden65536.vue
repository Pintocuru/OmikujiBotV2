<!-- src/MainGenerator/layouts/Golden65536/Golden65536.vue -->
<template>
  <div class="flex flex-col items-center">
    <DraggableWrapper>
      <CommentSpin />
    </DraggableWrapper>

    <DraggableWrapper>
      <div class="w-fit overflow-hidden">
        <div class="scale-75 origin-top">
          <StreamCounter />
        </div>
      </div>
    </DraggableWrapper>
  </div>
</template>

<script setup lang="ts">
  import DraggableWrapper from '../DraggableWrapper.vue'
  import CommentSpin from '@main/ui/CommentSpin/CommentSpin.vue'
  import StreamCounter from '@main/ui/StreamCounter/StreamCounter.vue'
</script>
