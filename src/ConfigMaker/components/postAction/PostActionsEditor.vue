<!-- src\ConfigMaker\components\postAction\PostActionsEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- ツールバー -->
    <OmikujiItemToolbar
      :modelValue="modelValue"
      :category="category"
      :selectedItemKey="selectedItemKey"
      @update:modelValue="updatePostActions"
      @toggleJson="toggleEditMode"
      @toggleEdit="toggleTabEditor"
    />

    <!-- PostActionsタブエディター -->
    <PostActionsTabs
      v-if="isTabEditorOpen"
      :modelValue="modelValue"
      :category="category"
      @update:actions="updatePostActions"
    />

    <!-- JSON編集モード -->
    <PostActionsEditorJson
      v-if="isJsonMode"
      :modelValue="modelValue"
      @update:modelValue="updatePostActions"
      @close="isJsonMode = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import OmikujiItemToolbar from '@/ConfigMaker/components/postAction/tooltab/OmikujiItemToolbar.vue'
  import PostActionsTabs from './tooltab/PostActionsTabs.vue'
  import PostActionsEditorJson from '@ConfigComponents/postAction/PostActionsEditorJson.vue'
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'

  const props = defineProps<{
    modelValue: PostActionType[]
    category: RulesCategoryType | 'actionSets'
    selectedItemKey: string | null
    index: number
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: PostActionType[]]
  }>()

  // Refs
  const isJsonMode = ref(false)
  const isTabEditorOpen = ref(props.category === 'actionSets' ? true : props.index === 0 ? true : false)

  // Methods
  const toggleTabEditor = () => {
    isTabEditorOpen.value = !isTabEditorOpen.value
    // JSONモードが開いていたら閉じる
    if (isTabEditorOpen.value) isJsonMode.value = false
  }

  const toggleEditMode = () => {
    isJsonMode.value = !isJsonMode.value
    // タブエディターが開いていたら閉じる
    if (isJsonMode.value) isTabEditorOpen.value = false
  }

  // PostActionsの更新
  const updatePostActions = (newActions: PostActionType[]) => {
    emit('update:modelValue', newActions)
  }
</script>
