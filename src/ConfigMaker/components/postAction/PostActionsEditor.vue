<!-- src/ConfigMaker/components/postAction/PostActionsEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- ツールバー -->
    <OmikujiItemToolbar :modelValue="modelValue" :gameScripts="gameScripts" @update:modelValue="updatePostActions" />

    <!-- PostActionsタブエディター -->
    <PostActionsTabs :modelValue="modelValue" @update:actions="updatePostActions" />
  </div>
</template>

<script setup lang="ts">
  import { GameScriptsType, PostFlowType } from '@/types/OmikujiData/'
  import PostActionsTabs from './tooltab/PostActionsTabs.vue'
  import OmikujiItemToolbar from '@config/components/postAction/tooltab/OmikujiItemToolbar.vue'

  defineProps<{
    modelValue: PostFlowType[]
    gameScripts: GameScriptsType | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: PostFlowType[]]
  }>()

  const updatePostActions = (newActions: PostFlowType[]) => {
    emit('update:modelValue', newActions)
  }
</script>
