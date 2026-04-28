<!-- src/MainGenerator/ui/LiveClock/common/RotatingMessage.vue -->
<template>
  <transition name="msg-slide" mode="out-in">
    <span :key="message" v-html="message" />
  </transition>
</template>

<script setup lang="ts">
  defineProps<{
    message: string
  }>()
</script>

<style scoped>
  .msg-slide-enter-active,
  .msg-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .msg-slide-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }

  .msg-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
</style>
