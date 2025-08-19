<!-- src/configMaker/components/parts/ModalFooterActions.vue -->
<template>
  <div class="modal-action">
    <button @click="onCancel" class="btn btn-ghost">❌ キャンセル</button>
    <button @click="onSave" class="btn btn-primary px-12" :disabled="disabled">
      {{ saveName || '💾 保存' }}
    </button>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    onCancel: () => void
    onSave: () => void
    saveName?: string
    disabled?: boolean
  }>()
</script>
