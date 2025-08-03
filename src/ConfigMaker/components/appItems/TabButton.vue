<!-- src/configMaker/components/TabButton.vue -->
<template>
 <button :class="buttonClass" :data-tip="tab.description" @click="$emit('click')">
  <component :is="tab.icon" class="w-8 h-8" />
  <span class="text-xs text-center whitespace-nowrap text-ellipsis">
   {{ tab.label }}
  </span>
  <ItemCountBadge v-if="itemCount > 0" :count="itemCount" />
 </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CategoryType } from '@/types/';
import ItemCountBadge from './ItemCountBadge.vue';

interface Props {
 tab: { label: string; description: string; icon: any };
 category: CategoryType;
 isActive: boolean;
 itemCount: number;
}

const props = defineProps<Props>();
defineEmits<{ click: [] }>();

const buttonClass = computed(() => [
 'tab w-16 h-16 tooltip tooltip-top',
 props.isActive ? 'tab-active' : ''
]);
</script>
