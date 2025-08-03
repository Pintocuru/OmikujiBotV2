<!-- src/configMaker/components/ConfigActions.vue -->
<template>
 <div class="flex flex-wrap justify-between items-center mb-2 gap-4 min-w-0">
  <ConfigImport />
  <ConfigExport :showTemplateButton="data.displaySettings.developer.showTemplateButton" />
 </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import ConfigImport from '@ConfigComponents/presets/ConfigImport.vue';
import ConfigExport from '@ConfigComponents/presets/ConfigExport.vue';

const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);
</script>
