<!-- src/configMaker/components/postAction/PostActionsEditor.vue -->
<template>
  <div class="form-control">
    <div class="flex justify-between items-center mb-1">
      <label class="label py-1">
        <span class="label-text text-sm font-medium">わんコメへの投稿</span>
        <span class="badge badge-sm badge-outline ml-2">{{ modelValue.length }}</span>
      </label>
      <div class="flex gap-2">
        <button @click="toggleEditMode" class="btn btn-sm btn-secondary" type="button">
          <span class="text-sm">{{ isJsonMode ? '📝' : '💾' }}</span>
          {{ isJsonMode ? 'GUI編集' : 'JSON編集' }}
        </button>
        <button @click="openDialog" class="btn btn-sm btn-primary" type="button">
          <span class="text-sm">⚙️</span>
          詳細編集
        </button>
      </div>
    </div>

    <!-- JSON編集モード -->
    <PostActionsEditorJson
      v-if="isJsonMode"
      :modelValue="modelValue"
      @update:modelValue="handleUpdate"
      @close="isJsonMode = false"
    />

    <!-- 通常のプレビュー表示 -->
    <PostActionsPreview v-else :actions="modelValue" />

    <!-- 編集ダイアログ -->
    <PostActionsEditDialog
      ref="dialog"
      :actions="modelValue"
      :charactersArray="charactersArray"
      @update:actions="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, Ref } from 'vue'
  import { PostActionType } from '@/types/'
  import PostActionsPreview from './PostActionsPreview.vue'
  import PostActionsEditDialog from './PostActionsEditDialog.vue'
  import PostActionsEditorJson from './PostActionsEditorJson.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

  // ストアを使用
  const omikujiStore = useOmikujiStore()
  const charactersArray = computed(() => omikujiStore.getCategoryArray('characters'))

  // Props
  const props = defineProps<{
    modelValue: PostActionType[]
  }>()

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: PostActionType[]]
  }>()

  // Refs
  const dialog: Ref<InstanceType<typeof PostActionsEditDialog> | null> = ref(null)
  const isJsonMode = ref(false)

  // Methods
  const openDialog = () => {
    dialog.value?.open()
  }

  const handleUpdate = (actions: PostActionType[]) => {
    emit('update:modelValue', actions)
  }

  const toggleEditMode = () => {
    isJsonMode.value = !isJsonMode.value
  }
</script>
