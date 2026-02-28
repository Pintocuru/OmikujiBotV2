<!-- src/ConfigMaker/components/appInfo/FlagsInfo/ComponentChip.vue -->
<template v-slot:ComponentChip="{ name, isGame }">
  <div class="badge badge-lg gap-2 p-4" :class="isGame ? 'badge-primary' : 'badge-accent'">
    <component :is="isGame ? Gamepad2 : LayoutGrid" class="w-4 h-4" />
    {{ name }}
  </div>
</template>

<script setup lang="ts">
  import { LayoutGrid, Gamepad2 } from 'lucide-vue-next'

  defineProps<{
    name: string
    isGame?: boolean
  }>()
</script>
