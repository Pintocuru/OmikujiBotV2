<!-- src/configMaker/components/postAction/PostActionsHeader.vue -->
<template>
 <div class="flex justify-between items-center bg-primary text-white rounded-t px-4 py-2">
  <h3 class="text-lg font-semibold">Post Actions 編集</h3>
  <div class="flex gap-2">
   <button @click="$emit('sort-by-delay')" class="btn btn-sm btn-secondary">📊 遅延順</button>
   <button @click="$emit('add-action')" class="btn btn-sm btn-accent">➕ 追加</button>
  </div>
 </div>
</template>

<script setup lang="ts">
// Emits
defineEmits<{
 'add-action': [];
 'sort-by-delay': [];
}>();
</script>
