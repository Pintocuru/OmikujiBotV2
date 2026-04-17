<!-- src/MainGenerator/layouts/VarietySlot/VarietySlot.vue -->
<template>
  <div class="flex flex-col items-center">
    <CommentSpin />

    <div class="w-fit overflow-hidden">
      <div class="scale-75 origin-top">
        <StreamCounter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CommentSpin from '@main/ui/CommentSpin/CommentSpin.vue'
  import StreamCounter from '@main/ui/StreamCounter/StreamCounter.vue'
</script>
