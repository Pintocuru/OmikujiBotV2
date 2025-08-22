<!-- src/configMaker/components/FloatingElements.vue -->
<template>
  <div>
    <!-- スクロールで表示されるDock（下部） 
    <div v-if="showDock" class="fixed bottom-0 w-full flex justify-center z-99">
      <div class="card bg-base-100/70 shadow backdrop-blur-sm mx-auto">
        <NavigationTabs />
      </div>
    </div>-->

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
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { ArrowUp } from 'lucide-vue-next'
  import { Toaster } from 'vue-sonner'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { useScrollBehavior } from './useScrollBehavior'
  import { useCategoryUtils } from './useCategoryUtils'
  import NavigationTabs from '@ConfigComponents/appItems/NavigationTabs.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { showScrollTopButton, showDock, scrollToTop } = useScrollBehavior()
  const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils()
</script>
