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

  <!-- トースト通知 -->
  <Toaster :expand="true" :richColors="true" :visibleToasts="5" />
</template>

<script setup lang="ts">
  import { useScrollBehavior } from './useScrollBehavior'
  import { ArrowUp } from 'lucide-vue-next'
  import { Toaster } from 'vue-sonner'

  const { showScrollTopButton, scrollToTop } = useScrollBehavior()
</script>
