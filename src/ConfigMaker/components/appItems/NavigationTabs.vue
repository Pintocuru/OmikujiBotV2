<!-- src/configMaker/components/NavigationTabs.vue -->
<template>
 <div
  class="flex w-full justify-center my-4 p-2 pt-4 rounded-md"
  :class="
   data.displaySettings.developer.godModeEnabled ? ['bg-warning text-accent-content'] : ['border']
  "
 >
  <div class="tabs gap-8">
   <button
    v-for="(tab, key) in filteredCategoryLabels"
    :key="key"
    :class="['tab w-16 h-16 tooltip tooltip-top', selectedCategory === key ? 'tab-active' : '']"
    :data-tip="tab.description"
    @click="omikujiStore.selectCategory(key)"
   >
    <component :is="tab.icon" class="w-8 h-8" />
    <span class="text-xs text-center whitespace-nowrap text-ellipsis">{{ tab.label }}</span>
    <span
     v-if="getCategoryItemCount(key) > 0"
     class="badge badge-xs badge-primary absolute -top-1 -right-1"
    >
     {{ getCategoryItemCount(key) }}
    </span>
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { useCategoryUtils } from './useCategoryUtils';

const omikujiStore = useOmikujiStore();
const { selectedCategory, data } = storeToRefs(omikujiStore);
const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils();
</script>
