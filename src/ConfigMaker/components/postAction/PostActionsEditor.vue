<!-- src\ConfigMaker\components\postAction\PostActionsEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- ツールバー -->
    <OmikujiItemToolbar
      :modelValue="modelValue"
      :gameScripts="gameScripts"
      @update:modelValue="updatePostActions"
      @toggleJson="toggleEditMode"
    />

    <!-- JSON編集モード -->
    <PostActionsEditorJson
      v-if="isJsonMode"
      :modelValue="modelValue"
      @update:modelValue="updatePostActions"
      @close="isJsonMode = false"
    />

    <!-- PostActionsタブエディター -->
    <PostActionsTabs v-else :modelValue="modelValue" @update:actions="updatePostActions" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { GameScriptsType, PostActionType } from '@/types/OmikujiData/'
  import PostActionsTabs from './tooltab/PostActionsTabs.vue'
  import OmikujiItemToolbar from '@config/components/postAction/tooltab/OmikujiItemToolbar.vue'
  import PostActionsEditorJson from '@config/components/postAction/PostActionsEditorJson.vue'

  const props = defineProps<{
    modelValue: PostActionType[]
    gameScripts: GameScriptsType | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: PostActionType[]]
  }>()

  // Refs
  const isJsonMode = ref(false)

  const toggleEditMode = () => {
    isJsonMode.value = !isJsonMode.value
  }

  // PostActionsの更新
  const updatePostActions = (newActions: PostActionType[]) => {
    emit('update:modelValue', newActions)
  }
</script>
