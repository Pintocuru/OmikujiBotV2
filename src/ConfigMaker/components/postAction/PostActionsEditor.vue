<!-- src/configMaker/components/postAction/PostActionsEditor.vue -->
<template>
  <div class="form-control">
    <div class="flex justify-between items-center mb-1">
      <label class="label py-1">
        <span class="label-text text-sm font-medium">わんコメへの投稿</span>
        <span class="badge badge-sm badge-outline ml-2">{{ modelValue.length }}</span>
      </label>
      <div class="flex gap-2">
        <button
          @click="() => useTestPost().postTestOmikujiItem(modelValue)"
          class="btn btn-sm btn-info tooltip tooltip-top"
          data-tip="わんコメを起動すると、投稿の確認ができます"
          :disabled="modelValue.length === 0"
        >
          テスト投稿
        </button>

        <!-- Json/GUI編集切り替えボタン -->
        <button @click="$emit('toggleJson')" class="btn btn-sm btn-secondary" type="button">
          <span class="text-sm">📝</span>
          JSON編集
        </button>

        <!-- 詳細編集ボタン -->
        <button @click="$emit('toggleEdit')" class="btn btn-sm btn-primary" type="button">
          <span class="text-sm">⚙️</span>
          詳細編集
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import { useTestPost } from '@/ConfigMaker/scripts/useTestPost'

  // Props
  const props = defineProps<{
    modelValue: PostActionType[]
  }>()

  // Emits
  const emit = defineEmits(['toggleEdit', 'toggleJson'])
</script>
