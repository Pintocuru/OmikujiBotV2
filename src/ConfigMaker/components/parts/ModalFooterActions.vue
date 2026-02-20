<!-- src/ConfigMaker/components/parts/ModalFooterActions.vue -->
<template>
  <div class="flex justify-end gap-2">
    <button @click="onCancel" class="btn btn-ghost text-base-content flex items-center gap-1">
      <X class="w-4 h-4" />
      キャンセル
    </button>
    <button @click="onSave" class="btn btn-primary px-12 flex items-center gap-1" :disabled="disabled">
      <Save class="w-4 h-4" />
      {{ saveName || '保存' }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { X, Save } from 'lucide-vue-next'

  defineProps<{
    onCancel: () => void
    onSave: () => void
    saveName?: string
    disabled?: boolean
  }>()
</script>
