<!-- src/configMaker/components/RuleTabs/BulkActionBar.vue -->
<template>
 <div class="bg-primary/10 p-3 rounded-lg border border-primary/20">
  <div class="flex items-center justify-between">
   <span class="text-sm font-medium">{{ selectedCount }}件選択中</span>
   <div class="flex gap-2">
    <button
     class="btn btn-sm btn-ghost"
     @click="$emit('selectAll')"
     :disabled="selectedCount === totalCount"
    >
     すべて選択
    </button>
    <button class="btn btn-sm btn-ghost" @click="$emit('clearSelection')">選択解除</button>
    <button
     class="btn btn-sm btn-error"
     @click="$emit('bulkDelete')"
     :disabled="selectedCount === 0"
    >
     選択したルールを削除
    </button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
defineProps<{
 selectedCount: number;
 totalCount: number;
}>();

defineEmits<{
 selectAll: [];
 clearSelection: [];
 bulkDelete: [];
}>();
</script>
