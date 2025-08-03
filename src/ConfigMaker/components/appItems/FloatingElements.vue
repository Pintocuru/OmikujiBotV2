<!-- src/configMaker/components/FloatingElements.vue -->
<template>
 <div>
  <!-- スクロールで表示されるDock（下部） -->
  <div v-if="showDock" class="dock dock-xl z-40">
   <button
    v-for="(tab, key) in categoryLabels"
    :key="key"
    class="tooltip tooltip-top"
    :class="
     data.displaySettings.developer.godModeEnabled ? ['bg-warning text-accent-content'] : ['border']
    "
    :data-tip="tab.description"
    @click="omikujiStore.selectCategory(key)"
   >
    <component :is="tab.icon" class="size-[1.2em]" />
    <span class="dock-label">{{ tab.label }}</span>
    <span
     v-if="getCategoryItemCount(key) > 0"
     class="badge badge-xs badge-primary absolute -top-1 -right-1"
    >
     {{ getCategoryItemCount(key) }}
    </span>
   </button>
  </div>

  <!-- スクロールトップボタン -->
  <button
   v-show="showScrollTopButton"
   @click="scrollToTop"
   class="fixed bottom-24 right-6 z-999 btn btn-xl btn-circle btn-primary p-1 shadow-lg transition-opacity duration-300"
  >
   <ArrowUp class="w-12 h-12" />
  </button>

  <!-- トースト通知 -->
  <Toaster :expand="true" :richColors="true" :visibleToasts="5" />
 </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ArrowUp } from 'lucide-vue-next';
import { Toaster } from 'vue-sonner';
import { categoryLabels } from '@/types/';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { useScrollBehavior } from './useScrollBehavior';
import { useCategoryUtils } from './useCategoryUtils';

const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);
const { showScrollTopButton, showDock, scrollToTop } = useScrollBehavior();
const { getCategoryItemCount } = useCategoryUtils();
</script>
