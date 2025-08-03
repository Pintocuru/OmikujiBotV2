<!-- src/configMaker/components/placeholders/PlaceholderValues.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex justify-between items-center">
   <div class="flex items-center">プレースホルダー設定</div>
  </div>
  <div class="card-body">
   <PlaceholderValuesEditor :placeholderId="placeholderId" :isModal="false" />
  </div>
 </div>
</template>

<script setup lang="ts">
import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue';

const props = defineProps<{
 placeholderId: string;
}>();
</script>
