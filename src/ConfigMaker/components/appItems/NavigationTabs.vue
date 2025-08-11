<!-- src/configMaker/components/NavigationTabs.vue -->
<template>
 <div
  class="flex w-full justify-center my-4 rounded-md"
  :class="
   data.displaySettings.developer.godModeEnabled ? ['bg-warning text-warning-content'] : ['border']
  "
 >
  <div class="tabs gap-2">
   <div v-for="(tab, key) in filteredCategoryLabels">
    <button
     class="tab w-full h-full p-4 pt-6 tooltip tooltip-top tab-active hover:bg-primary"
     :data-tip="tab.description"
     @click="omikujiStore.selectCategory(key)"
    >
     <div class="flex flex-col items-center justify-center space-y-1">
      <component :is="tab.icon" class="w-8 h-8" />
      <span class="text-xs text-center whitespace-nowrap text-ellipsis">{{ tab.label }}</span>
     </div>
     <span
      v-if="getCategoryItemCount(key) > 0"
      class="badge badge-xs badge-primary absolute top-1 right-1"
     >
      {{ getCategoryItemCount(key) }}
     </span>
    </button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { useCategoryUtils } from './useCategoryUtils';

const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);
const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils();
</script>
