<!-- src/ConfigMaker/components/parts/InformationCard.vue -->
<template>
  <!-- 補足説明 -->
  <div class="alert alert-info w-full">
    <Info class="w-5 h-5 mt-0.5 shrink-0" />
    <div class="space-y-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Info } from 'lucide-vue-next'
  const props = defineProps<{}>()
</script>
