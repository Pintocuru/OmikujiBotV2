<!-- src/ConfigMaker/components/postAction/variable/VariableSettings.vue -->
<template>
  <SettingItem label="💬 メッセージ内容" description="プレースホルダーが使えます">
    <MessageTextDialog v-model="bubbleText" :isCommentMode="true" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostFlowVariableType } from '@/types'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import MessageTextDialog from '../Message/MessageTextDialog.vue'

  const props = defineProps<{
    action: PostFlowVariableType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowVariableType]
  }>()

  // --- Helper Functions ---
  const updateAction = (updates: Partial<PostFlowVariableType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const bubbleText = computed<string>({
    get: () => props.action.message.bubble ?? '',
    set: (value) =>
      updateAction({
        message: { ...props.action.message, bubble: value },
      }),
  })
</script>
