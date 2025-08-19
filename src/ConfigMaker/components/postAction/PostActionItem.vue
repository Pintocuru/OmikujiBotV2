<!-- src/configMaker/components/postAction/PostActionItem.vue -->
<template>
  <div
    class="card bg-base-200 p-4 relative"
    :class="['border-l-6', index % 2 === 0 ? 'border-l-accent' : 'border-l-primary']"
  >
    <!-- 右下固定の操作ボタン -->
    <div class="absolute bottom-2 right-2">
      <MenuDropdown @duplicate="$emit('duplicate', index)" @delete="$emit('remove', index)" />
    </div>

    <!-- 基本設定: 横並び3つ -->
    <PostActionBasicSettings
      :action="action"
      :character-options="characterOptions"
      @update:action="$emit('update:action', $event)"
    />

    <!-- メッセージ系フィールド -->
    <PostActionMessageFields :action="action" :index="index" />
  </div>
</template>

<script setup lang="ts">
  import { PostActionType } from '@/types/'
  import MenuDropdown from '@ConfigComponents/parts/MenuDropdown.vue'
  import PostActionBasicSettings from './PostActionBasicSettings.vue'
  import PostActionMessageFields from './PostActionMessageFields.vue'

  // Props
  const props = defineProps<{
    action: PostActionType
    index: number
    characterOptions: Array<{ value: string; label: string }>
  }>()

  // Emits
  const emit = defineEmits<{
    duplicate: [index: number]
    remove: [index: number]
    'update:action': [value: PostActionType]
  }>()
</script>
