<!-- src/configMaker/components/FloatingElements.vue -->
<template>
  <!-- スクロールトップボタン -->
  <button
    v-show="showScrollTopButton"
    @click="scrollToTop"
    class="fixed bottom-36 right-6 z-98 btn btn-xl btn-circle btn-primary p-1 shadow-lg transition-opacity duration-300"
  >
    <ArrowUp class="w-12 h-12" />
  </button>
</template>

<script setup lang="ts">
  import { useScrollBehavior } from './useScrollBehavior'
  import { ArrowUp } from 'lucide-vue-next'

  const { showScrollTopButton, scrollToTop } = useScrollBehavior()
</script>
