<!-- src/ConfigMaker/components/presetsImport/ConflictsList.vue -->
<template>
  <div class="text-sm">
    <div class="text-warning pb-1">競合項目 ({{ conflicts.length }}件):</div>
    <div class="max-h-25 overflow-y-auto">
      <span
        v-for="conflictKey in conflicts"
        :key="conflictKey.key"
        class="inline-block bg-warning bg-opacity-20 text-warning-content px-2 py-1 rounded mr-1 mb-1"
      >
        {{ conflictKey.key }}
        <span v-if="conflictKey.name && conflictKey.name !== ''">({{ conflictKey.name }})</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ConflictInfo } from './ImportTypes'

  interface Props {
    conflicts: ConflictInfo[]
  }

  defineProps<Props>()
</script>
