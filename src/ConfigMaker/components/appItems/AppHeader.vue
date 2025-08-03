<!-- src/configMaker/components/AppHeader.vue -->
<template>
 <h1 class="text-2xl font-bold mb-6 text-center text-primary">
  おみくじBot コンフィグエディター
  <span v-if="data.displaySettings.developer.godModeEnabled" class="badge badge-warning">
   GOD-MODE
  </span>
 </h1>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';

const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);
</script>
