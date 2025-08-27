<!-- src\ConfigMaker\components\postAction\OmikujiItemToolbar.vue -->
<template>
  <div class="form-control">
    <div class="flex justify-between items-center mb-1">
      <label class="label">
        <span class="label-text font-medium">わんコメへの投稿</span>
        <div class="relative">
          <span
            class="badge badge-outline ml-2 cursor-pointer flex items-center gap-1 transition-colors hover:bg-primary hover:text-white"
            @mouseenter="showPreview = true"
            @mouseleave="showPreview = false"
            @click="$emit('toggleEdit')"
          >
            <List class="h-4 w-4" />
            <span class="pl-1"> {{ modelValue.length }} </span>
          </span>

          <!-- ホバー時のプレビュー表示 -->
          <div
            v-if="showPreview && modelValue.length > 0"
            class="absolute top-8 left-0 z-50 bg-base-100 shadow-lg rounded-lg border w-96 sm:w-160 max-h-64 overflow-y-auto"
            @mouseenter="showPreview = true"
            @mouseleave="showPreview = false"
          >
            <PostActionsPreview :modelValue="modelValue" />
          </div>
        </div>
      </label>

      <div class="flex gap-2">
        <button
          @click="() => useTestPost().postTestOmikujiItem(modelValue)"
          class="btn btn-sm btn-info tooltip tooltip-top"
          data-tip="わんコメを起動すると、投稿の確認ができます"
          :disabled="modelValue.length === 0"
        >
          <Send :size="16" />
          テスト投稿
        </button>

        <button @click="$emit('toggleJson')" class="btn btn-sm btn-secondary" type="button">
          <FileJson :size="16" />
          JSON編集
        </button>

        <button @click="$emit('toggleEdit')" class="btn btn-sm btn-primary" type="button">
          <Settings :size="16" />
          詳細編集
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import PostActionsPreview from '@ConfigComponents/postAction/PostActionsPreview.vue'
  import { useTestPost } from '@/ConfigMaker/scripts/useTestPost'
  import { List, Send, FileJson, Settings } from 'lucide-vue-next'

  // Props
  const props = defineProps<{
    modelValue: PostActionType[]
  }>()

  // Emits
  const emit = defineEmits(['toggleEdit', 'toggleJson'])

  // ホバー状態管理
  const showPreview = ref(false)
</script>
